import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class PedidosScreen extends StatefulWidget {
  @override
  _PedidosScreenState createState() => _PedidosScreenState();
}

class _PedidosScreenState extends State<PedidosScreen> {
  List<Map<String, dynamic>> _pedidos = [];

  @override
  void initState() {
    super.initState();
    _fetchPedidos();
  }

  Future<void> _fetchPedidos() async {
    final response = await http.get(Uri.parse('http://10.0.2.2:5000/pedidos'));

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      setState(() {
        _pedidos = List<Map<String, dynamic>>.from(data);
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error al obtener pedidos')),
      );
    }
  }

  void _showAddPedidoDialog() {
    final _formKey = GlobalKey<FormState>();
    TextEditingController idUsuarioController = TextEditingController();
    TextEditingController totalController = TextEditingController();
    TextEditingController estadoController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text('Crear Pedido'),
          content: Form(
            key: _formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextFormField(
                  controller: idUsuarioController,
                  decoration: InputDecoration(labelText: 'ID Usuario'),
                  keyboardType: TextInputType.number,
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'El ID de usuario es obligatorio';
                    }
                    return null;
                  },
                ),
                TextFormField(
                  controller: totalController,
                  decoration: InputDecoration(labelText: 'Total'),
                  keyboardType: TextInputType.number,
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'El total es obligatorio';
                    }
                    final total = double.tryParse(value);
                    if (total == null || total <= 0) {
                      return 'Ingrese un total válido';
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
                  final response = await http.post(
                    Uri.parse('http://10.0.2.2:5000/pedidos'),
                    headers: {'Content-Type': 'application/json'},
                    body: jsonEncode({
                      'idUsuario': int.parse(idUsuarioController.text),
                      'fechaPedido': DateTime.now().toIso8601String(),
                      'total': double.parse(totalController.text),
                      'estado': estadoController.text,
                    }),
                  );

                  if (response.statusCode == 201) {
                    _fetchPedidos(); // Refresca la tabla
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Pedido creado')),
                    );
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Error al crear pedido')),
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
      appBar: AppBar(title: Text('Gestión de Pedidos')),
      body: Column(
        children: [
          ElevatedButton(
            onPressed: _showAddPedidoDialog,
            child: Text('Crear Pedido'),
          ),
          Expanded(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: DataTable(
                columns: [
                  DataColumn(label: Text('ID Pedido')),
                  DataColumn(label: Text('Usuario')),
                  DataColumn(label: Text('Fecha Pedido')),
                  DataColumn(label: Text('Total')),
                  DataColumn(label: Text('Estado')),
                ],
                rows: _pedidos.map((pedido) {
                  return DataRow(cells: [
                    DataCell(Text(pedido['idPedido'].toString())),
                    DataCell(Text(pedido['usuario']['nombre'])),
                    DataCell(Text(pedido['fechaPedido'])),
                    DataCell(Text(pedido['total'].toString())),
                    DataCell(Text(pedido['estado'])),
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
