import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class ReportesScreen extends StatefulWidget {
  @override
  _ReportesScreenState createState() => _ReportesScreenState();
}

class _ReportesScreenState extends State<ReportesScreen> {
  List<dynamic> _reportes = [];

  @override
  void initState() {
    super.initState();
    _fetchReportes();
  }

  Future<void> _fetchReportes() async {
    final response = await http.get(Uri.parse('http://10.0.2.2:5000/reportes'));
    if (response.statusCode == 200) {
      setState(() {
        _reportes = jsonDecode(response.body);
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error al obtener reportes')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Reportes de Ventas')),
      body: ListView.builder(
        itemCount: _reportes.length,
        itemBuilder: (context, index) {
          final reporte = _reportes[index];
          return Card(
            margin: EdgeInsets.all(10),
            child: ListTile(
              title: Text('Sucursal ID: ${reporte['idSucursal']}'),
              subtitle: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Fecha: ${reporte['fecha']}'),
                  Text('Total Ventas: Q.${reporte['totalVentas']}'),
                  Text('Productos Vendidos: ${reporte['productosVendidos']}'),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
