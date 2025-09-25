import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSales } from "@/hooks/useSales";
import { useProducts } from "@/hooks/useProducts";
import { useEmployees } from "@/hooks/useEmployees";
import { useClients } from "@/hooks/useClients";
import { 
  FileText, 
  Download, 
  Calendar,
  TrendingUp,
  Package,
  Users,
  DollarSign,
  Loader2,
  Settings,
  BarChart3
} from "lucide-react";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface ReportConfig {
  type: 'sales' | 'products' | 'employees' | 'clients' | 'comprehensive';
  period: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
  startDate?: string;
  endDate?: string;
  includeCharts: boolean;
  includeDetails: boolean;
  format: 'pdf' | 'excel';
}

export default function PDFReports() {
  const { sales } = useSales();
  const { products } = useProducts();
  const { employees } = useEmployees();
  const { clients } = useClients();
  
  const [config, setConfig] = useState<ReportConfig>({
    type: 'sales',
    period: 'month',
    includeCharts: true,
    includeDetails: true,
    format: 'pdf'
  });
  const [isGenerating, setIsGenerating] = useState(false);

  // Filtrer les données selon la période
  const filteredData = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    switch (config.period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'custom':
        startDate = config.startDate ? new Date(config.startDate) : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        endDate = config.endDate ? new Date(config.endDate) : now;
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const filteredSales = sales.filter(sale => {
      const saleDate = sale.createdAt.toDate();
      return saleDate >= startDate && saleDate <= endDate;
    });

    return {
      sales: filteredSales,
      startDate,
      endDate,
      products,
      employees,
      clients
    };
  }, [sales, products, employees, clients, config]);

  // Calculer les statistiques
  const statistics = useMemo(() => {
    const { sales: filteredSales } = filteredData;
    
    const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalOrders = filteredSales.length;
    const averageOrder = totalOrders > 0 ? totalSales / totalOrders : 0;
    
    // Ventes par jour
    const salesByDay = filteredSales.reduce((acc, sale) => {
      const date = sale.createdAt.toDate().toLocaleDateString('fr-FR');
      acc[date] = (acc[date] || 0) + sale.total;
      return acc;
    }, {} as Record<string, number>);

    // Top produits
    const productSales = new Map();
    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
          const current = productSales.get(product.name) || { name: product.name, sales: 0, quantity: 0 };
          current.sales += item.price * item.quantity;
          current.quantity += item.quantity;
          productSales.set(product.name, current);
        }
      });
    });

    const topProducts = Array.from(productSales.values())
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10);

    return {
      totalSales,
      totalOrders,
      averageOrder,
      salesByDay,
      topProducts
    };
  }, [filteredData, products]);

  // Générer le rapport PDF
  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 20;

      // En-tête
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('RAPPORT EBO\'O GEST', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Période: ${config.startDate ? 
        `${new Date(config.startDate).toLocaleDateString('fr-FR')} - ${new Date(config.endDate || Date.now()).toLocaleDateString('fr-FR')}` :
        config.period === 'today' ? 'Aujourd\'hui' :
        config.period === 'week' ? '7 derniers jours' :
        config.period === 'month' ? 'Ce mois' :
        config.period === 'quarter' ? 'Ce trimestre' :
        config.period === 'year' ? 'Cette année' : 'Période personnalisée'
      }`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;

      doc.text(`Généré le: ${new Date().toLocaleString('fr-FR')}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;

      // Statistiques principales
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('RÉSUMÉ EXÉCUTIF', 20, yPosition);
      yPosition += 15;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Total des ventes: ${statistics.totalSales.toLocaleString()} FCFA`, 20, yPosition);
      yPosition += 8;
      doc.text(`Nombre de commandes: ${statistics.totalOrders}`, 20, yPosition);
      yPosition += 8;
      doc.text(`Panier moyen: ${Math.round(statistics.averageOrder).toLocaleString()} FCFA`, 20, yPosition);
      yPosition += 20;

      // Détail des ventes par jour
      if (config.includeDetails) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('VENTES PAR JOUR', 20, yPosition);
        yPosition += 15;

        const salesTableData = Object.entries(statistics.salesByDay).map(([date, amount]) => [
          date,
          `${amount.toLocaleString()} FCFA`
        ]);

        (doc as any).autoTable({
          head: [['Date', 'Montant']],
          body: salesTableData,
          startY: yPosition,
          styles: { fontSize: 10 },
          headStyles: { fillColor: [41, 128, 185] }
        });

        yPosition = (doc as any).lastAutoTable.finalY + 15;
      }

      // Top produits
      if (config.includeDetails && statistics.topProducts.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('TOP PRODUITS', 20, yPosition);
        yPosition += 15;

        const productsTableData = statistics.topProducts.map(product => [
          product.name,
          product.quantity.toString(),
          `${product.sales.toLocaleString()} FCFA`
        ]);

        (doc as any).autoTable({
          head: [['Produit', 'Quantité', 'CA']],
          body: productsTableData,
          startY: yPosition,
          styles: { fontSize: 10 },
          headStyles: { fillColor: [39, 174, 96] }
        });

        yPosition = (doc as any).lastAutoTable.finalY + 15;
      }

      // Détail des ventes individuelles
      if (config.includeDetails && filteredData.sales.length > 0) {
        doc.addPage();
        yPosition = 20;

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('DÉTAIL DES VENTES', 20, yPosition);
        yPosition += 15;

        const salesDetailData = filteredData.sales.map(sale => [
          sale.createdAt.toDate().toLocaleString('fr-FR'),
          `${sale.total.toLocaleString()} FCFA`,
          sale.items.length.toString(),
          'Non spécifié' // Payment method not available in Sale interface
        ]);

        (doc as any).autoTable({
          head: [['Date/Heure', 'Total', 'Articles', 'Paiement']],
          body: salesDetailData,
          startY: yPosition,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [155, 89, 182] },
          pageBreak: 'auto'
        });
      }

      // Pied de page
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(`Page ${i} sur ${pageCount}`, pageWidth - 30, pageHeight - 10);
        doc.text('Ebo\'o Gest - Système de Gestion', 20, pageHeight - 10);
      }

      // Télécharger le fichier
      const fileName = `rapport-ebo-gest-${config.type}-${config.period}-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Erreur lors de la génération du rapport. Veuillez réessayer.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Rapports PDF
          </h2>
          <p className="text-muted-foreground">
            Générez et téléchargez des rapports professionnels
          </p>
        </div>
        <Button
          onClick={generatePDF}
          disabled={isGenerating}
          className="btn-gradient"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Génération...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Générer PDF
            </>
          )}
        </Button>
      </div>

      {/* Configuration du rapport */}
      <Card className="card-stats">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuration du Rapport
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Type de rapport */}
            <div className="space-y-2">
              <Label htmlFor="report-type">Type de rapport</Label>
              <Select 
                value={config.type} 
                onValueChange={(value: any) => setConfig(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Ventes</SelectItem>
                  <SelectItem value="products">Produits</SelectItem>
                  <SelectItem value="employees">Employés</SelectItem>
                  <SelectItem value="clients">Clients</SelectItem>
                  <SelectItem value="comprehensive">Complet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Période */}
            <div className="space-y-2">
              <Label htmlFor="period">Période</Label>
              <Select 
                value={config.period} 
                onValueChange={(value: any) => setConfig(prev => ({ ...prev, period: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Aujourd'hui</SelectItem>
                  <SelectItem value="week">7 derniers jours</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                  <SelectItem value="quarter">Ce trimestre</SelectItem>
                  <SelectItem value="year">Cette année</SelectItem>
                  <SelectItem value="custom">Période personnalisée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dates personnalisées */}
          {config.period === 'custom' && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start-date">Date de début</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={config.startDate || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">Date de fin</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={config.endDate || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>
          )}

          {/* Options */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="include-charts"
                checked={config.includeCharts}
                onChange={(e) => setConfig(prev => ({ ...prev, includeCharts: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="include-charts">Inclure les graphiques</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="include-details"
                checked={config.includeDetails}
                onChange={(e) => setConfig(prev => ({ ...prev, includeDetails: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="include-details">Inclure les détails</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aperçu des statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="card-stats">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Ventes</p>
                <p className="text-2xl font-bold">{statistics.totalSales.toLocaleString()} FCFA</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-stats">
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Commandes</p>
              <p className="text-2xl font-bold">{statistics.totalOrders}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-stats">
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Panier Moyen</p>
              <p className="text-2xl font-bold">{Math.round(statistics.averageOrder).toLocaleString()} FCFA</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-stats">
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Produits Vendus</p>
              <p className="text-2xl font-bold">{products.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Types de rapports disponibles */}
      <Card className="card-stats">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Types de Rapports Disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold">Rapport Ventes</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Analyse complète des ventes avec statistiques et tendances
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold">Rapport Produits</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Performance des produits et gestion des stocks
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold">Rapport Employés</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Performance et productivité du personnel
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                <h4 className="font-semibold">Rapport Complet</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Vue d'ensemble complète de l'activité
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
