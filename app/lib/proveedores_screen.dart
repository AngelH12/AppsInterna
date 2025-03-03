import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class ProveedoresScreen extends StatefulWidget {
  @override
  _ProveedoresScreenState createState() => _ProveedoresScreenState();
}

class _ProveedoresScreenState extends State<ProveedoresScreen> {
  List<Map<String, dynamic>> _proveedores = [];

  @override
  void initState() {
    super.initState();
    _fetchProveedores();
  }

  Future<void> _fetchProveedores() async {
    final response = await http.get(Uri.parse('http://10.0.2.2:5000/proveedores'));

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      setState(() {
        _proveedores = List<Map<String, dynamic>>.from(data);
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error al obtener proveedores')),
      );
    }
  }

  Future<void> _deleteProveedor(int id) async {
    final response = await http.delete(Uri.parse('http://10.0.2.2:5000/proveedores/$id'));

    if (response.statusCode == 200) {
      setState(() {
        _proveedores.removeWhere((item) => item['idProveedor'] == id);
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Proveedor eliminado')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error al eliminar el proveedor')),
      );
    }
  }

  void _showAddProveedorDialog({Map<String, dynamic>? item}) {
    final _formKey = GlobalKey<FormState>();
    TextEditingController nombreController = TextEditingController(text: item?['nombre'] ?? '');
    TextEditingController telefonoController = TextEditingController(text: item?['telefono'] ?? '');
    TextEditingController direccionController = TextEditingController(text: item?['direccion'] ?? '');
    TextEditingController correoController = TextEditingController(text: item?['correo'] ?? '');
    TextEditingController tipoProductoController = TextEditingController(text: item?['tipoProducto'] ?? '');

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text(item == null ? 'Agregar Proveedor' : 'Editar Proveedor'),
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
                  controller: telefonoController,
                  decoration: InputDecoration(labelText: 'Teléfono'),
                  keyboardType: TextInputType.phone,
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'El teléfono es obligatorio';
                    }
                    return null;
                  },
                ),
                TextFormField(
                  controller: direccionController,
                  decoration: InputDecoration(labelText: 'Dirección'),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'La dirección es obligatoria';
                    }
                    return null;
                  },
                ),
                TextFormField(
                  controller: correoController,
                  decoration: InputDecoration(labelText: 'Correo'),
                  keyboardType: TextInputType.emailAddress,
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'El correo es obligatorio';
                    }
                    return null;
                  },
                ),
                TextFormField(
                  controller: tipoProductoController,
                  decoration: InputDecoration(labelText: 'Tipo de Producto'),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'El tipo de producto es obligatorio';
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
                          Uri.parse('http://10.0.2.2:5000/proveedores'),
                          headers: {'Content-Type': 'application/json'},
                          body: jsonEncode({
                            'nombre': nombreController.text,
                            'telefono': telefonoController.text,
                            'direccion': direccionController.text,
                            'correo': correoController.text,
                            'tipoProducto': tipoProductoController.text,
                          }),
                        )
                      : http.put(
                          Uri.parse('http://10.0.2.2:5000/proveedores/${item['idProveedor']}'),
                          headers: {'Content-Type': 'application/json'},
                          body: jsonEncode({
                            'nombre': nombreController.text,
                            'telefono': telefonoController.text,
                            'direccion': direccionController.text,
                            'correo': correoController.text,
                            'tipoProducto': tipoProductoController.text,
                          }),
                        ));

                  if (response.statusCode == 200 || response.statusCode == 201) {
                    _fetchProveedores(); // Refresca la tabla
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text(item == null ? 'Proveedor agregado' : 'Proveedor actualizado')),
                    );
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Error al guardar proveedor')),
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
      appBar: AppBar(title: Text('Gestión de Proveedores')),
      body: Column(
        children: [
          ElevatedButton(
            onPressed: () => _showAddProveedorDialog(),
            child: Text('Agregar Proveedor'),
          ),
          Expanded(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: DataTable(
                columns: [
                  DataColumn(label: Text('ID')),
                  DataColumn(label: Text('Nombre')),
                  DataColumn(label: Text('Teléfono')),
                  DataColumn(label: Text('Dirección')),
                  DataColumn(label: Text('Correo')),
                  DataColumn(label: Text('Tipo Producto')),
                  DataColumn(label: Text('Acciones')),
                ],
                rows: _proveedores.map((item) {
                  return DataRow(cells: [
                    DataCell(Text(item['idProveedor'].toString())),
                    DataCell(Text(item['nombre'])),
                    DataCell(Text(item['telefono'])),
                    DataCell(Text(item['direccion'])),
                    DataCell(Text(item['correo'])),
                    DataCell(Text(item['tipoProducto'])),
                    DataCell(Row(
                      children: [
                        IconButton(
                          icon: Icon(Icons.edit, color: Colors.orange),
                          onPressed: () => _showAddProveedorDialog(item: item),
                        ),
                        IconButton(
                          icon: Icon(Icons.delete, color: Colors.red),
                          onPressed: () => _deleteProveedor(item['idProveedor']),
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
