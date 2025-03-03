import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class GuarnicionesScreen extends StatefulWidget {
  @override
  _GuarnicionesScreenState createState() => _GuarnicionesScreenState();
}

class _GuarnicionesScreenState extends State<GuarnicionesScreen> {
  List<Map<String, dynamic>> _guarniciones = [];

  @override
  void initState() {
    super.initState();
    _fetchGuarniciones();
  }

  Future<void> _fetchGuarniciones() async {
    final response = await http.get(Uri.parse('http://10.0.2.2:5000/guarniciones'));

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      setState(() {
        _guarniciones = List<Map<String, dynamic>>.from(data);
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error al obtener guarniciones')),
      );
    }
  }

  Future<void> _deleteGuarnicion(int id) async {
    final response = await http.delete(Uri.parse('http://10.0.2.2:5000/guarniciones/$id'));

    if (response.statusCode == 200) {
      setState(() {
        _guarniciones.removeWhere((item) => item['idGuarnicion'] == id);
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Guarnición eliminada')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error al eliminar la guarnición')),
      );
    }
  }

  void _showAddGuarnicionDialog({Map<String, dynamic>? item}) {
    final _formKey = GlobalKey<FormState>();
    TextEditingController nombreController = TextEditingController(text: item?['nombre'] ?? '');
    TextEditingController precioController = TextEditingController(text: item?['precio']?.toString() ?? '');
    TextEditingController stockController = TextEditingController(text: item?['stock']?.toString() ?? '');

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text(item == null ? 'Agregar Guarnición' : 'Editar Guarnición'),
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
                  controller: precioController,
                  decoration: InputDecoration(labelText: 'Precio'),
                  keyboardType: TextInputType.number,
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'El precio es obligatorio';
                    }
                    final precio = double.tryParse(value);
                    if (precio == null || precio <= 0) {
                      return 'Ingrese un precio válido';
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
                    if (stock == null || stock <= 0) {
                      return 'Ingrese un stock válido';
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
                          Uri.parse('http://10.0.2.2:5000/guarniciones'),
                          headers: {'Content-Type': 'application/json'},
                          body: jsonEncode({
                            'nombre': nombreController.text,
                            'precio': double.parse(precioController.text),
                            'stock': int.parse(stockController.text),
                            'activo': true,
                          }),
                        )
                      : http.put(
                          Uri.parse('http://10.0.2.2:5000/guarniciones/${item['idGuarnicion']}'),
                          headers: {'Content-Type': 'application/json'},
                          body: jsonEncode({
                            'nombre': nombreController.text,
                            'precio': double.parse(precioController.text),
                            'stock': int.parse(stockController.text),
                            'activo': true,
                          }),
                        ));

                  if (response.statusCode == 200 || response.statusCode == 201) {
                    _fetchGuarniciones(); // Refresca la tabla
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text(item == null ? 'Guarnición agregada' : 'Guarnición actualizada')),
                    );
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Error al guardar la guarnición')),
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
      appBar: AppBar(title: Text('Gestión de Guarniciones')),
      body: Column(
        children: [
          ElevatedButton(
            onPressed: () => _showAddGuarnicionDialog(),
            child: Text('Agregar Guarnición'),
          ),
          Expanded(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: DataTable(
                columns: [
                  DataColumn(label: Text('ID')),
                  DataColumn(label: Text('Nombre')),
                  DataColumn(label: Text('Precio')),
                  DataColumn(label: Text('Stock')),
                  DataColumn(label: Text('Acciones')),
                ],
                rows: _guarniciones.map((item) {
                  return DataRow(cells: [
                    DataCell(Text(item['idGuarnicion'].toString())),
                    DataCell(Text(item['nombre'])),
                    DataCell(Text(item['precio'].toString())),
                    DataCell(Text(item['stock'].toString())),
                    DataCell(Row(
                      children: [
                        IconButton(
                          icon: Icon(Icons.edit, color: Colors.orange),
                          onPressed: () => _showAddGuarnicionDialog(item: item),
                        ),
                        IconButton(
                          icon: Icon(Icons.delete, color: Colors.red),
                          onPressed: () => _deleteGuarnicion(item['idGuarnicion']),
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
