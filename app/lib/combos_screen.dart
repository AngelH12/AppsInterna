import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class CombosScreen extends StatefulWidget {
  @override
  _CombosScreenState createState() => _CombosScreenState();
}

class _CombosScreenState extends State<CombosScreen> {
  List<Map<String, dynamic>> _combos = [];

  @override
  void initState() {
    super.initState();
    _fetchCombos();
  }

  Future<void> _fetchCombos() async {
    final response = await http.get(Uri.parse('http://localhost:5000/combos'));

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      setState(() {
        _combos = List<Map<String, dynamic>>.from(data);
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error al obtener combos')),
      );
    }
  }

  void _showAddComboDialog() {
    final _formKey = GlobalKey<FormState>();
    TextEditingController nombreController = TextEditingController();
    TextEditingController descripcionController = TextEditingController();
    TextEditingController precioController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text('Agregar Combo'),
          content: Form(
            key: _formKey,
            child: SingleChildScrollView(
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
                    controller: descripcionController,
                    decoration: InputDecoration(labelText: 'Descripción'),
                    validator: (value) {
                      if (value == null || value.trim().isEmpty) {
                        return 'La descripción es obligatoria';
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
                ],
              ),
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
                    Uri.parse('http://10.0.2.2:5000/combos'),
                    headers: {'Content-Type': 'application/json'},
                    body: jsonEncode({
                      'nombre': nombreController.text,
                      'descripcion': descripcionController.text,
                      'precio': double.parse(precioController.text),
                      'activo': true,
                    }),
                  );

                  if (response.statusCode == 201) {
                    _fetchCombos(); // Refresca la tabla
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Combo agregado')),
                    );
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Error al agregar combo')),
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
      appBar: AppBar(title: Text('Gestión de Combos')),
      body: Column(
        children: [
          ElevatedButton(
            onPressed: _showAddComboDialog,
            child: Text('Agregar Combo'),
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
                  DataColumn(label: Text('Acciones')),
                ],
                rows: _combos.map((combo) {
                  return DataRow(cells: [
                    DataCell(Text(combo['idCombo'].toString())),
                    DataCell(Text(combo['nombre'])),
                    DataCell(Text(combo['descripcion'])),
                    DataCell(Text(combo['precio'].toString())),
                    DataCell(Row(
                      children: [
                        IconButton(
                          icon: Icon(Icons.delete, color: Colors.red),
                          onPressed: () {
                          },
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
