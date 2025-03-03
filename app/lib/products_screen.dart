import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class ProductsScreen extends StatefulWidget {
  @override
  _ProductsScreenState createState() => _ProductsScreenState();
}

class _ProductsScreenState extends State<ProductsScreen> {
  List<Map<String, dynamic>> _productos = [];

  @override
  void initState() {
    super.initState();
    _fetchProductos();
  }

  Future<void> _fetchProductos() async {
    final response =
        await http.get(Uri.parse('http://10.0.2.2:5000/productos'));

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      setState(() {
        _productos = List<Map<String, dynamic>>.from(data);
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error al obtener productos')),
      );
    }
  }

  Future<void> _deleteProducto(int id) async {
    final response =
        await http.delete(Uri.parse('http://10.0.2.2:5000/productos/$id'));

    if (response.statusCode == 200) {
      setState(() {
        _productos.removeWhere((producto) => producto['idProducto'] == id);
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Producto eliminado')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error al eliminar producto')),
      );
    }
  }

  void _showAddProductDialog() {
    TextEditingController nombreController = TextEditingController();
    TextEditingController descripcionController = TextEditingController();
    TextEditingController precioController = TextEditingController();
    TextEditingController tipoController = TextEditingController();
    TextEditingController stockController = TextEditingController();
    TextEditingController unidadController = TextEditingController();
    TextEditingController imagenController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text('Agregar Producto'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                    controller: nombreController,
                    decoration: InputDecoration(labelText: 'Nombre')),
                TextField(
                    controller: descripcionController,
                    decoration: InputDecoration(labelText: 'Descripción')),
                TextField(
                    controller: precioController,
                    decoration: InputDecoration(labelText: 'Precio')),
                TextField(
                    controller: tipoController,
                    decoration: InputDecoration(labelText: 'Tipo Producto')),
                TextField(
                    controller: stockController,
                    decoration: InputDecoration(labelText: 'Stock')),
                TextField(
                    controller: unidadController,
                    decoration: InputDecoration(labelText: 'Unidad de Medida')),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text('Cancelar'),
            ),
            ElevatedButton(
              onPressed: () async {
                Map<String, dynamic> productoData = {
                  'nombre': nombreController.text,
                  'descripcion': descripcionController.text,
                  'precio': double.parse(precioController.text),
                  'tipoProducto': tipoController.text,
                  'stock': int.parse(stockController.text),
                  'unidadMedida': unidadController.text,
                  'imagen': "https://example.com/laptop-hp.jpg",
                  'activo': true,
                };


                final response = await http.post(
                  Uri.parse('http://10.0.2.2:5000/productos'),
                  headers: {'Content-Type': 'application/json'},
                  body: jsonEncode(productoData),
                );

                if (response.statusCode == 200) {
                  _fetchProductos();
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Producto agregado')),
                  );
                } else {
                  print("response${response}");

                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Error al agregar producto')),
                  );
                }
              },
              child: Text('Guardar'),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Gestión de Productos')),
      body: Column(
        children: [
          ElevatedButton(
            onPressed: _showAddProductDialog,
            child: Text('Agregar Producto'),
          ),
          Expanded(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: DataTable(
                columns: [
                  DataColumn(label: Text('ID')),
                  DataColumn(label: Text('Nombre')),
                  DataColumn(label: Text('Descripción')),
                  DataColumn(label: Text('Precio')),
                  DataColumn(label: Text('Stock')),
                  DataColumn(label: Text('Unidad')),
                  DataColumn(label: Text('Acciones')),
                ],
                rows: _productos.map((producto) {
                  return DataRow(cells: [
                    DataCell(Text(producto['idProducto'].toString())),
                    DataCell(Text(producto['nombre'])),
                    DataCell(Text(producto['descripcion'])),
                    DataCell(Text(producto['precio'].toString())),
                    DataCell(Text(producto['stock'].toString())),
                    DataCell(Text(producto['unidadMedida'])),
                    DataCell(Row(
                      children: [
                        IconButton(
                          icon: Icon(Icons.delete, color: Colors.red),
                          onPressed: () =>
                              _deleteProducto(producto['idProducto']),
                        ),
                      ],
                    )),
                  ]);
                }).toList(),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
