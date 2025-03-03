import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'combos_screen.dart';
import 'envios_screen.dart';
import 'guarniciones_screen.dart';
import 'ingredientes_screen.dart';
import 'inventario_screen.dart';
import 'users_screen.dart';
import 'products_screen.dart';
import 'pedidos_screen.dart';
import 'proveedores_screen.dart';
import 'reservas_screen.dart';

class HomeScreen extends StatelessWidget {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width; 
    double screenHeight = MediaQuery.of(context).size.height; 

    return Scaffold(
      key: _scaffoldKey,
      appBar: AppBar(
        title: Text('Dashboard'),
        leading: IconButton(
          icon: Icon(Icons.menu),
          onPressed: () {
            _scaffoldKey.currentState?.openDrawer();
          },
        ),
      ),
      drawer: _buildDrawer(context),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildMetricCards(screenWidth),
            SizedBox(height: 20),
            Text('Ventas Mensuales', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            SizedBox(height: 10),
            _buildSalesChart(screenWidth),
            SizedBox(height: 20),
            Text('Ingresos vs Costos', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            SizedBox(height: 10),
            _buildIncomeVsCostChart(screenWidth),
          ],
        ),
      ),
    );
  }

  Widget _buildDrawer(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          DrawerHeader(
            decoration: BoxDecoration(color: Colors.blue),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(Icons.account_circle, size: 50, color: Colors.white),
                SizedBox(height: 10),
                Text("Usuario", style: TextStyle(color: Colors.white, fontSize: 18)),
                Text("correo@example.com", style: TextStyle(color: Colors.white70, fontSize: 14)),
              ],
            ),
          ),
          _buildMenuItem(Icons.people, 'Gestión de Usuarios', context, UsersScreen()),
          _buildMenuItem(Icons.shopping_cart, 'Gestión de Productos', context, ProductsScreen()),
          _buildMenuItem(Icons.fastfood, 'Gestión de Combos', context, CombosScreen()),
          _buildMenuItem(Icons.receipt, 'Gestión de Pedidos', context, PedidosScreen()),
          _buildMenuItem(Icons.inventory, 'Gestión de Inventario', context, InventarioScreen()),
          _buildMenuItem(Icons.business, 'Gestión de Proveedores', context, ProveedoresScreen()),
          _buildMenuItem(Icons.event_seat, 'Gestión de Reservas', context, ReservasScreen()),
          _buildMenuItem(Icons.local_shipping, 'Gestión de Envíos', context, EnviosScreen()),
          _buildMenuItem(Icons.fastfood, 'Gestión de Guarniciones', context, GuarnicionesScreen()),
          _buildMenuItem(Icons.kitchen, 'Gestión de Ingredientes', context, IngredientesScreen()),

          ListTile(
            leading: Icon(Icons.logout),
            title: Text('Cerrar sesión'),
            onTap: () {
              Navigator.pop(context);
              Navigator.pushReplacementNamed(context, "/login");
            },
          ),
        ],
      ),
    );
  }

  Widget _buildMetricCards(double screenWidth) {
    return LayoutBuilder(
      builder: (context, constraints) {
        return Wrap(
          spacing: 10,
          runSpacing: 10,
          children: [
            _buildMetricCard('Ventas Diarias', 'Q. 5,200', Colors.green, screenWidth),
            _buildMetricCard('Ganancias Mensuales', 'Q. 20,000', Colors.blue, screenWidth),
            _buildMetricCard('Platos más vendidos', 'Churrasco', Colors.orange, screenWidth),
            _buildMetricCard('Desperdicios', 'Q. 500', Colors.red, screenWidth),
          ],
        );
      },
    );
  }

  Widget _buildMetricCard(String title, String value, Color color, double screenWidth) {
    double cardWidth = screenWidth > 600 ? screenWidth / 4 - 20 : screenWidth / 2 - 20;

    return Container(
      width: cardWidth,
      child: Card(
        elevation: 5,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        color: color,
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: Column(
            children: [
              Text(title, style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
              SizedBox(height: 5),
              Text(value, style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSalesChart(double screenWidth) {
    return Container(
      width: screenWidth,
      height: 250,
      padding: EdgeInsets.all(12),
      decoration: _chartDecoration(),
      child: LineChart(
        LineChartData(
          gridData: FlGridData(show: false),
          titlesData: _chartTitles(['Ene', 'Feb', 'Mar', 'Abr']),
          borderData: FlBorderData(show: false),
          lineBarsData: [
            LineChartBarData(
              spots: [FlSpot(0, 4000), FlSpot(1, 3200), FlSpot(2, 5800), FlSpot(3, 4900)],
              isCurved: true,
              color: Colors.blue,
              barWidth: 4,
              belowBarData: BarAreaData(show: true, color: Colors.blue.withOpacity(0.3)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildIncomeVsCostChart(double screenWidth) {
    return Container(
      width: screenWidth,
      height: 250,
      padding: EdgeInsets.all(12),
      decoration: _chartDecoration(),
      child: BarChart(
        BarChartData(
          gridData: FlGridData(show: false),
          titlesData: _chartTitles(['Ingresos', 'Costos']),
          borderData: FlBorderData(show: false),
          barGroups: [
            BarChartGroupData(x: 0, barRods: [BarChartRodData(toY: 20000, color: Colors.green, width: 20)]),
            BarChartGroupData(x: 1, barRods: [BarChartRodData(toY: 12000, color: Colors.red, width: 20)]),
          ],
        ),
      ),
    );
  }

  BoxDecoration _chartDecoration() {
    return BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 5)]);
  }

  ListTile _buildMenuItem(IconData icon, String title, BuildContext context, Widget screen) {
    return ListTile(
      leading: Icon(icon),
      title: Text(title),
      onTap: () {
        Navigator.pop(context);
        Navigator.push(context, MaterialPageRoute(builder: (context) => screen));
      },
    );
  }

  FlTitlesData _chartTitles(List<String> labels) {
    return FlTitlesData(
      bottomTitles: AxisTitles(sideTitles: SideTitles(showTitles: true, getTitlesWidget: (value, _) => Text(labels[value.toInt()]))),
      leftTitles: AxisTitles(sideTitles: SideTitles(showTitles: true)),
    );
  }
}
