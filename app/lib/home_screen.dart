import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import 'ReportesScreen.dart';
import 'SucursalesScreen.dart';
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

  Future<double> _fetchTotalVentasDiarias() async {
    try {
      final response = await http.get(Uri.parse('http://10.0.2.2:5000/reportes'));
      if (response.statusCode == 200) {
        List<dynamic> reportes = jsonDecode(response.body);

        print("Datos de reportes recibidos: $reportes");

        double totalVentas = reportes.fold(0.0, (sum, item) => sum + (item['totalVentas'] ?? 0.0));

        print("Total Ventas: $totalVentas");

        return totalVentas; 
      } else {
        throw Exception('Error al obtener reportes');
      }
    } catch (e) {
      throw Exception('Error de conexión con el servidor');
    }
  }

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;

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
            FutureBuilder<double>(
              future: _fetchTotalVentasDiarias(),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return CircularProgressIndicator(); 
                } else if (snapshot.hasError) {
                  return Text("Error al cargar datos"); 
                } else {
                  return _buildMetricCards(screenWidth, snapshot.data ?? 0.0); 
                }
              },
            ),
            // _buildSalesChart(screenWidth),
            SizedBox(height: 20),
            Text('Ingresos vs Costos', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            SizedBox(height: 10),
            _buildIncomeVsCostChart(screenWidth),
          ],
        ),
      ),
    );
  }

  Widget _buildMetricCards(double screenWidth, double totalVentasDiarias) {
    return LayoutBuilder(
      builder: (context, constraints) {
        return Wrap(
          spacing: 10,
          runSpacing: 10,
          children: [
            _buildMetricCard('Ventas Diarias', 'Q. ${totalVentasDiarias.toStringAsFixed(2)}', Colors.green, screenWidth),
            _buildMetricCard('Platos más vendidos', 'Churrasco', Colors.orange, screenWidth),
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
          _buildMenuItem(Icons.kitchen, 'Gestión de Reportes', context, ReportesScreen()),
          _buildMenuItem(Icons.kitchen, 'Gestión de Sucursales', context, SucursalesScreen()),
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

  FlTitlesData _chartTitles(List<String> labels) {
    return FlTitlesData(
      bottomTitles: AxisTitles(sideTitles: SideTitles(showTitles: true, getTitlesWidget: (value, _) => Text(labels[value.toInt()]))),
      leftTitles: AxisTitles(sideTitles: SideTitles(showTitles: true)),
    );
  }
