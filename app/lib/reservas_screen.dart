import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class ReservasScreen extends StatefulWidget {
  @override
  _ReservasScreenState createState() => _ReservasScreenState();
}

class _ReservasScreenState extends State<ReservasScreen> {
  List<Map<String, dynamic>> _reservas = [];

  @override
  void initState() {
    super.initState();
    _fetchReservas();
  }

  Future<void> _fetchReservas() async {
    final response = await http.get(Uri.parse('http://10.0.2.2:5000/reservas'));

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      setState(() {
        _reservas = List<Map<String, dynamic>>.from(data);
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error al obtener reservas')),
      );
    }
  }

  Future<void> _deleteReserva(int id) async {
    final response = await http.delete(Uri.parse('http://10.0.2.2:5000/reservas/$id'));

    if (response.statusCode == 200) {
      setState(() {
        _reservas.removeWhere((item) => item['idReserva'] == id);
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Reserva eliminada')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error al eliminar la reserva')),
      );
    }
  }

  void _showAddReservaDialog({Map<String, dynamic>? item}) {
    final _formKey = GlobalKey<FormState>();
    TextEditingController nombreController = TextEditingController(text: item?['nombreCliente'] ?? '');
    TextEditingController fechaController = TextEditingController(text: item?['fecha'] ?? '');
    TextEditingController cantidadController = TextEditingController(text: item?['cantidadPersonas']?.toString() ?? '');
    TextEditingController estadoController = TextEditingController(text: item?['estado'] ?? '');

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text(item == null ? 'Agregar Reserva' : 'Editar Reserva'),
          content: Form(
            key: _formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextFormField(
                  controller: nombreController,
                  decoration: InputDecoration(labelText: 'Nombre Cliente'),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'El nombre es obligatorio';
                    }
                    return null;
                  },
                ),
                TextFormField(
                  controller: fechaController,
                  decoration: InputDecoration(labelText: 'Fecha (YYYY-MM-DD HH:MM)'),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'La fecha es obligatoria';
                    }
                    return null;
                  },
                ),
                TextFormField(
                  controller: cantidadController,
                  decoration: InputDecoration(labelText: 'Cantidad de Personas'),
                  keyboardType: TextInputType.number,
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'La cantidad de personas es obligatoria';
                    }
                    final cantidad = int.tryParse(value);
                    if (cantidad == null || cantidad <= 0) {
                      return 'Ingrese un número válido';
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
                          Uri.parse('http://10.0.2.2:5000/reservas'),
                          headers: {'Content-Type': 'application/json'},
                          body: jsonEncode({
                            'nombreCliente': nombreController.text,
                            'fecha': fechaController.text,
                            'cantidadPersonas': int.parse(cantidadController.text),
                            'estado': estadoController.text,
                          }),
                        )
                      : http.put(
                          Uri.parse('http://10.0.2.2:5000/reservas/${item['idReserva']}'),
                          headers: {'Content-Type': 'application/json'},
                          body: jsonEncode({
                            'nombreCliente': nombreController.text,
                            'fecha': fechaController.text,
                            'cantidadPersonas': int.parse(cantidadController.text),
                            'estado': estadoController.text,
                          }),
                        ));

                  if (response.statusCode == 200 || response.statusCode == 201) {
                    _fetchReservas(); // Refresca la tabla
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text(item == null ? 'Reserva agregada' : 'Reserva actualizada')),
                    );
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Error al guardar la reserva')),
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
      appBar: AppBar(title: Text('Gestión de Reservas')),
      body: Column(
        children: [
          ElevatedButton(
            onPressed: () => _showAddReservaDialog(),
            child: Text('Agregar Reserva'),
          ),
          Expanded(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: DataTable(
                columns: [
                  DataColumn(label: Text('ID')),
                  DataColumn(label: Text('Cliente')),
                  DataColumn(label: Text('Fecha')),
                  DataColumn(label: Text('Personas')),
                  DataColumn(label: Text('Estado')),
                  DataColumn(label: Text('Acciones')),
                ],
                rows: _reservas.map((item) {
                  return DataRow(cells: [
                    DataCell(Text(item['idReserva'].toString())),
                    DataCell(Text(item['nombreCliente'])),
                    DataCell(Text(item['fecha'])),
                    DataCell(Text(item['cantidadPersonas'].toString())),
                    DataCell(Text(item['estado'])),
                    DataCell(Row(
                      children: [
                        IconButton(
                          icon: Icon(Icons.edit, color: Colors.orange),
                          onPressed: () => _showAddReservaDialog(item: item),
                        ),
                        IconButton(
                          icon: Icon(Icons.delete, color: Colors.red),
                          onPressed: () => _deleteReserva(item['idReserva']),
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
