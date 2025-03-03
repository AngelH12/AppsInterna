import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class InventarioScreen extends StatefulWidget {
  @override
  _InventarioScreenState createState() => _InventarioScreenState();
}

class _InventarioScreenState extends State<InventarioScreen> {
  List<Map<String, dynamic>> _inventario = [];

  @override
  void initState() {
    super.initState();
    _fetchInventario();
  }

  Future<void> _fetchInventario() async {
    final response = await http.get(Uri.parse('http://10.0.2.2:5000/inventario'));

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      setState(() {
        _inventario = List<Map<String, dynamic>>.from(data);
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error al obtener el inventario')),
      );
    }
  }

  Future<void> _deleteInventario(int id) async {
    final response = await http.delete(Uri.parse('http://10.0.2.2:5000/inventario/$id'));

    if (response.statusCode == 200) {
      setState(() {
        _inventario.removeWhere((item) => item['idInventario'] == id);
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Registro eliminado')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error al eliminar el registro')),
      );
    }
  }

  void _showAddInventarioDialog({Map<String, dynamic>? item}) {
    final _formKey = GlobalKey<FormState>();
    TextEditingController idIngredienteController = TextEditingController(text: item?['idIngrediente']?.toString() ?? '');
    TextEditingController cantidadController = TextEditingController(text: item?['cantidad']?.toString() ?? '');
    TextEditingController tipoMovimientoController = TextEditingController(text: item?['tipoMovimiento'] ?? '');
    TextEditingController detalleController = TextEditingController(text: item?['detalle'] ?? '');

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text(item == null ? 'Agregar Registro' : 'Editar Registro'),
          content: Form(
            key: _formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextFormField(
                  controller: idIngredienteController,
                  decoration: InputDecoration(labelText: 'ID Ingrediente'),
                  keyboardType: TextInputType.number,
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'El ID del ingrediente es obligatorio';
                    }
                    return null;
                  },
                ),
                TextFormField(
                  controller: cantidadController,
                  decoration: InputDecoration(labelText: 'Cantidad'),
                  keyboardType: TextInputType.number,
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'La cantidad es obligatoria';
                    }
                    final cantidad = int.tryParse(value);
                    if (cantidad == null || cantidad <= 0) {
                      return 'Ingrese una cantidad válida';
                    }
                    return null;
                  },
                ),
                TextFormField(
                  controller: tipoMovimientoController,
                  decoration: InputDecoration(labelText: 'Tipo Movimiento'),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'El tipo de movimiento es obligatorio';
                    }
                    return null;
                  },
                ),
                TextFormField(
                  controller: detalleController,
                  decoration: InputDecoration(labelText: 'Detalle'),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'El detalle es obligatorio';
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
                          Uri.parse('http://10.0.2.2:5000/inventario'),
                          headers: {'Content-Type': 'application/json'},
                          body: jsonEncode({
                            'idIngrediente': int.parse(idIngredienteController.text),
                            'cantidad': int.parse(cantidadController.text),
                            'tipoMovimiento': tipoMovimientoController.text,
                            'detalle': detalleController.text,
                          }),
                        )
                      : http.put(
                          Uri.parse('http://10.0.2.2:5000/inventario/${item['idInventario']}'),
                          headers: {'Content-Type': 'application/json'},
                          body: jsonEncode({
                            'idIngrediente': int.parse(idIngredienteController.text),
                            'cantidad': int.parse(cantidadController.text),
                            'tipoMovimiento': tipoMovimientoController.text,
                            'detalle': detalleController.text,
                          }),
                        ));

                  if (response.statusCode == 200 || response.statusCode == 201) {
                    _fetchInventario(); 
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text(item == null ? 'Registro agregado' : 'Registro actualizado')),
                    );
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Error al guardar registro')),
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
      appBar: AppBar(title: Text('Gestión de Inventario')),
      body: Column(
        children: [
          ElevatedButton(
            onPressed: () => _showAddInventarioDialog(),
            child: Text('Agregar Registro'),
          ),
          Expanded(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: DataTable(
                columns: [
                  DataColumn(label: Text('ID')),
                  DataColumn(label: Text('Ingrediente')),
                  DataColumn(label: Text('Cantidad')),
                  DataColumn(label: Text('Tipo Movimiento')),
                  DataColumn(label: Text('Fecha')),
                  DataColumn(label: Text('Detalle')),
                  DataColumn(label: Text('Acciones')),
                ],
                rows: _inventario.map((item) {
                  return DataRow(cells: [
                    DataCell(Text(item['idInventario'].toString())),
                    DataCell(Text(item['ingrediente']['nombre'])),
                    DataCell(Text(item['cantidad'].toString())),
                    DataCell(Text(item['tipoMovimiento'])),
                    DataCell(Text(item['fechaMovimiento'])),
                    DataCell(Text(item['detalle'])),
                    DataCell(Row(
                      children: [
                        IconButton(
                          icon: Icon(Icons.edit, color: Colors.orange),
                          onPressed: () => _showAddInventarioDialog(item: item),
                        ),
                        IconButton(
                          icon: Icon(Icons.delete, color: Colors.red),
                          onPressed: () => _deleteInventario(item['idInventario']),
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
