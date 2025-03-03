import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class IngredientesScreen extends StatefulWidget {
  @override
  _IngredientesScreenState createState() => _IngredientesScreenState();
}

class _IngredientesScreenState extends State<IngredientesScreen> {
  List<Map<String, dynamic>> _ingredientes = [];

  @override
  void initState() {
    super.initState();
    _fetchIngredientes();
  }

  Future<void> _fetchIngredientes() async {
    final response = await http.get(Uri.parse('http://10.0.2.2:5000/ingredientes'));

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      setState(() {
        _ingredientes = List<Map<String, dynamic>>.from(data);
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error al obtener ingredientes')),
      );
    }
  }

  Future<void> _deleteIngrediente(int id) async {
    final response = await http.delete(Uri.parse('http://10.0.2.2:5000/ingredientes/$id'));

    if (response.statusCode == 200) {
      setState(() {
        _ingredientes.removeWhere((item) => item['idIngrediente'] == id);
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Ingrediente eliminado')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error al eliminar el ingrediente')),
      );
    }
  }

  void _showAddIngredienteDialog({Map<String, dynamic>? item}) {
    final _formKey = GlobalKey<FormState>();
    TextEditingController nombreController = TextEditingController(text: item?['nombre'] ?? '');
    TextEditingController stockController = TextEditingController(text: item?['stock']?.toString() ?? '');
    TextEditingController unidadController = TextEditingController(text: item?['unidadMedida'] ?? '');
    TextEditingController tipoController = TextEditingController(text: item?['tipo'] ?? '');
    TextEditingController precioController = TextEditingController(text: item?['precioUnitario']?.toString() ?? '');

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text(item == null ? 'Agregar Ingrediente' : 'Editar Ingrediente'),
          content: Form(
            key: _formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextFormField(
                  controller: nombreController,
                  decoration: InputDecoration(labelText: 'Nombre'),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'El nombre es obligatorio';
                    }
                    return null;
                  },
                ),
                TextFormField(
                  controller: stockController,
                  decoration: InputDecoration(labelText: 'Stock'),
                  keyboardType: TextInputType.number,
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'El stock es obligatorio';
                    }
                    final stock = int.tryParse(value);
                    if (stock == null || stock < 0) {
                      return 'Ingrese un stock válido';
                    }
                    return null;
                  },
                ),
                TextFormField(
                  controller: unidadController,
                  decoration: InputDecoration(labelText: 'Unidad de Medida'),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'La unidad de medida es obligatoria';
                    }
                    return null;
                  },
                ),
                TextFormField(
                  controller: tipoController,
                  decoration: InputDecoration(labelText: 'Tipo'),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'El tipo es obligatorio';
                    }
                    return null;
                  },
                ),
                TextFormField(
                  controller: precioController,
                  decoration: InputDecoration(labelText: 'Precio Unitario'),
                  keyboardType: TextInputType.number,
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'El precio unitario es obligatorio';
                    }
                    final precio = double.tryParse(value);
                    if (precio == null || precio <= 0) {
                      return 'Ingrese un precio válido';
                    }
                    return null;
                  },
                ),
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
                if (_formKey.currentState!.validate()) {
                  final response = await (item == null
                      ? http.post(
                          Uri.parse('http://10.0.2.2:5000/ingredientes'),
                          headers: {'Content-Type': 'application/json'},
                          body: jsonEncode({
                            'nombre': nombreController.text,
                            'stock': int.parse(stockController.text),
                            'unidadMedida': unidadController.text,
                            'tipo': tipoController.text,
                            'precioUnitario': double.parse(precioController.text),
                            'activo': true,
                          }),
                        )
                      : http.put(
                          Uri.parse('http://10.0.2.2:5000/ingredientes/${item['idIngrediente']}'),
                          headers: {'Content-Type': 'application/json'},
                          body: jsonEncode({
                            'nombre': nombreController.text,
                            'stock': int.parse(stockController.text),
                            'unidadMedida': unidadController.text,
                            'tipo': tipoController.text,
                            'precioUnitario': double.parse(precioController.text),
                            'activo': true,
                          }),
                        ));

                  if (response.statusCode == 200 || response.statusCode == 201) {
                    _fetchIngredientes(); // Refresca la tabla
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text(item == null ? 'Ingrediente agregado' : 'Ingrediente actualizado')),
                    );
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Error al guardar el ingrediente')),
                    );
                  }
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
      appBar: AppBar(title: Text('Gestión de Ingredientes')),
      body: Column(
        children: [
          ElevatedButton(
            onPressed: () => _showAddIngredienteDialog(),
            child: Text('Agregar Ingrediente'),
          ),
          Expanded(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: DataTable(
                columns: [
                  DataColumn(label: Text('ID')),
                  DataColumn(label: Text('Nombre')),
                  DataColumn(label: Text('Stock')),
                  DataColumn(label: Text('Unidad')),
                  DataColumn(label: Text('Tipo')),
                  DataColumn(label: Text('Precio Unitario')),
                  DataColumn(label: Text('Acciones')),
                ],
                rows: _ingredientes.map((item) {
                  return DataRow(cells: [
                    DataCell(Text(item['idIngrediente'].toString())),
                    DataCell(Text(item['nombre'])),
                    DataCell(Text(item['stock'].toString())),
                    DataCell(Text(item['unidadMedida'])),
                    DataCell(Text(item['tipo'])),
                    DataCell(Text('Q. ${item['precioUnitario']}')),
                    DataCell(Row(
                      children: [
                        IconButton(
                          icon: Icon(Icons.edit, color: Colors.orange),
                          onPressed: () => _showAddIngredienteDialog(item: item),
                        ),
                        IconButton(
                          icon: Icon(Icons.delete, color: Colors.red),
                          onPressed: () => _deleteIngrediente(item['idIngrediente']),
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
