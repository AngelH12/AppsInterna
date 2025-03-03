import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class EnviosScreen extends StatefulWidget {
  @override
  _EnviosScreenState createState() => _EnviosScreenState();
}

class _EnviosScreenState extends State<EnviosScreen> {
  List<Map<String, dynamic>> _envios = [];

  @override
  void initState() {
    super.initState();
    _fetchEnvios();
  }

  Future<void> _fetchEnvios() async {
    final response = await http.get(Uri.parse('http://10.0.2.2:5000/envios'));

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      setState(() {
        _envios = List<Map<String, dynamic>>.from(data);
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error al obtener envíos')),
      );
    }
  }

  Future<void> _deleteEnvio(int id) async {
    final response = await http.delete(Uri.parse('http://10.0.2.2:5000/envios/$id'));

    if (response.statusCode == 200) {
      setState(() {
        _envios.removeWhere((item) => item['idEnvio'] == id);
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Envío eliminado')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error al eliminar el envío')),
      );
    }
  }

  void _showAddEnvioDialog({Map<String, dynamic>? item}) {
    final _formKey = GlobalKey<FormState>();
    TextEditingController idPedidoController = TextEditingController(text: item?['idPedido']?.toString() ?? '');
    TextEditingController direccionController = TextEditingController(text: item?['direccion'] ?? '');
    TextEditingController telefonoController = TextEditingController(text: item?['telefono'] ?? '');
    TextEditingController estadoController = TextEditingController(text: item?['estado'] ?? '');

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text(item == null ? 'Agregar Envío' : 'Editar Envío'),
          content: Form(
            key: _formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextFormField(
                  controller: idPedidoController,
                  decoration: InputDecoration(labelText: 'ID Pedido'),
                  keyboardType: TextInputType.number,
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'El ID del pedido es obligatorio';
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
                  controller: estadoController,
                  decoration: InputDecoration(labelText: 'Estado'),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'El estado es obligatorio';
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
                          Uri.parse('http://10.0.2.2:5000/envios'),
                          headers: {'Content-Type': 'application/json'},
                          body: jsonEncode({
                            'idPedido': int.parse(idPedidoController.text),
                            'direccion': direccionController.text,
                            'telefono': telefonoController.text,
                            'estado': estadoController.text,
                          }),
                        )
                      : http.put(
                          Uri.parse('http://10.0.2.2:5000/envios/${item['idEnvio']}'),
                          headers: {'Content-Type': 'application/json'},
                          body: jsonEncode({
                            'idPedido': int.parse(idPedidoController.text),
                            'direccion': direccionController.text,
                            'telefono': telefonoController.text,
                            'estado': estadoController.text,
                          }),
                        ));

                  if (response.statusCode == 200 || response.statusCode == 201) {
                    _fetchEnvios(); 
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text(item == null ? 'Envío agregado' : 'Envío actualizado')),
                    );
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Error al guardar el envío')),
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
      appBar: AppBar(title: Text('Gestión de Envíos')),
      body: Column(
        children: [
          ElevatedButton(
            onPressed: () => _showAddEnvioDialog(),
            child: Text('Agregar Envío'),
          ),
          Expanded(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: DataTable(
                columns: [
                  DataColumn(label: Text('ID Envío')),
                  DataColumn(label: Text('ID Pedido')),
                  DataColumn(label: Text('Dirección')),
                  DataColumn(label: Text('Teléfono')),
                  DataColumn(label: Text('Estado')),
                  DataColumn(label: Text('Acciones')),
                ],
                rows: _envios.map((item) {
                  return DataRow(cells: [
                    DataCell(Text(item['idEnvio'].toString())),
                    DataCell(Text(item['idPedido'].toString())),
                    DataCell(Text(item['direccion'])),
                    DataCell(Text(item['telefono'])),
                    DataCell(Text(item['estado'])),
                    DataCell(Row(
                      children: [
                        IconButton(
                          icon: Icon(Icons.edit, color: Colors.orange),
                          onPressed: () => _showAddEnvioDialog(item: item),
                        ),
                        IconButton(
                          icon: Icon(Icons.delete, color: Colors.red),
                          onPressed: () => _deleteEnvio(item['idEnvio']),
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
