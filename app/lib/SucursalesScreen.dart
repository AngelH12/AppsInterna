import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class SucursalesScreen extends StatefulWidget {
  @override
  _SucursalesScreenState createState() => _SucursalesScreenState();
}

class _SucursalesScreenState extends State<SucursalesScreen> {
  List<dynamic> _sucursales = [];

  @override
  void initState() {
    super.initState();
    _fetchSucursales();
  }

  Future<void> _fetchSucursales() async {
    final response = await http.get(Uri.parse('http://10.0.2.2:5000/sucursales'));
    if (response.statusCode == 200) {
      setState(() {
        _sucursales = jsonDecode(response.body);
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error al obtener sucursales')),
      );
    }
  }

  Future<void> _deleteSucursal(int id) async {
    final response = await http.delete(Uri.parse('http://10.0.2.2:5000/sucursales/$id'));
    if (response.statusCode == 204) {
      setState(() {
        _sucursales.removeWhere((sucursal) => sucursal['idSucursal'] == id);
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Sucursal eliminada')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error al eliminar la sucursal')),
      );
    }
  }

  void _showSucursalDialog({Map<String, dynamic>? sucursal}) {
    final _formKey = GlobalKey<FormState>();
    TextEditingController nombreController = TextEditingController(text: sucursal?['nombre'] ?? '');
    TextEditingController direccionController = TextEditingController(text: sucursal?['direccion'] ?? '');
    TextEditingController telefonoController = TextEditingController(text: sucursal?['telefono'] ?? '');

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text(sucursal == null ? 'Agregar Sucursal' : 'Editar Sucursal'),
          content: Form(
            key: _formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextFormField(
                  controller: nombreController,
                  decoration: InputDecoration(labelText: 'Nombre'),
                  validator: (value) => value == null || value.trim().isEmpty ? 'Campo obligatorio' : null,
                ),
                TextFormField(
                  controller: direccionController,
                  decoration: InputDecoration(labelText: 'Dirección'),
                  validator: (value) => value == null || value.trim().isEmpty ? 'Campo obligatorio' : null,
                ),
                TextFormField(
                  controller: telefonoController,
                  decoration: InputDecoration(labelText: 'Teléfono'),
                  keyboardType: TextInputType.phone,
                  validator: (value) => value == null || value.trim().isEmpty ? 'Campo obligatorio' : null,
                ),
              ],
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: Text('Cancelar')),
            ElevatedButton(
              onPressed: () async {
                if (_formKey.currentState!.validate()) {
                  final Map<String, dynamic> newSucursal = {
                    'nombre': nombreController.text,
                    'direccion': direccionController.text,
                    'telefono': telefonoController.text,
                    'activo': true
                  };

                  final response = await (sucursal == null
                      ? http.post(Uri.parse('http://10.0.2.2:5000/sucursales'),
                          headers: {'Content-Type': 'application/json'},
                          body: jsonEncode(newSucursal))
                      : http.put(Uri.parse('http://10.0.2.2:5000/sucursales/${sucursal['idSucursal']}'),
                          headers: {'Content-Type': 'application/json'},
                          body: jsonEncode(newSucursal)));

                  if (response.statusCode == 200 || response.statusCode == 201) {
                    _fetchSucursales();
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text(sucursal == null ? 'Sucursal agregada' : 'Sucursal actualizada')),
                    );
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Error al guardar la sucursal')),
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
      appBar: AppBar(title: Text('Gestión de Sucursales')),
      body: Column(
        children: [
          ElevatedButton(
            onPressed: () => _showSucursalDialog(),
            child: Text('Agregar Sucursal'),
          ),
          Expanded(
            child: ListView.builder(
              itemCount: _sucursales.length,
              itemBuilder: (context, index) {
                final sucursal = _sucursales[index];
                return ListTile(
                  title: Text(sucursal['nombre']),
                  subtitle: Text(sucursal['direccion']),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      IconButton(icon: Icon(Icons.edit, color: Colors.orange), onPressed: () => _showSucursalDialog(sucursal: sucursal)),
                      IconButton(icon: Icon(Icons.delete, color: Colors.red), onPressed: () => _deleteSucursal(sucursal['idSucursal'])),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
