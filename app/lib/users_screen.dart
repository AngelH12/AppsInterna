import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class UsersScreen extends StatefulWidget {
  @override
  _UsersScreenState createState() => _UsersScreenState();
}

class _UsersScreenState extends State<UsersScreen> {
  List<Map<String, dynamic>> _usuarios = [];

  @override
  void initState() {
    super.initState();
    _fetchUsuarios();
  }

  Future<void> _fetchUsuarios() async {
    final response = await http.get(Uri.parse('http://10.0.2.2:5000/usuarios'));

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      setState(() {
        _usuarios = List<Map<String, dynamic>>.from(data);
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error al obtener usuarios')),
      );
    }
  }

  Future<void> _deleteUsuario(int id) async {
    final response = await http.delete(Uri.parse('http://10.0.2.2:5000/usuarios/$id'));

    if (response.statusCode == 200) {
      setState(() {
        _usuarios.removeWhere((user) => user['idUsuario'] == id);
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Usuario eliminado')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error al eliminar usuario')),
      );
    }
  }

  void _showAddUserDialog() {
    TextEditingController nombreController = TextEditingController();
    TextEditingController correoController = TextEditingController();
    TextEditingController passwordController = TextEditingController();
    TextEditingController rolController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text('Agregar Usuario'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(controller: nombreController, decoration: InputDecoration(labelText: 'Nombre')),
              TextField(controller: correoController, decoration: InputDecoration(labelText: 'Correo')),
              TextField(controller: passwordController, decoration: InputDecoration(labelText: 'Contraseña'), obscureText: true),
              TextField(controller: rolController, decoration: InputDecoration(labelText: 'Rol')),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text('Cancelar'),
            ),
            ElevatedButton(
              onPressed: () async {
                final response = await http.post(
                  Uri.parse('http://10.0.2.2:5000/usuarios'),
                  headers: {'Content-Type': 'application/json'},
                  body: jsonEncode({
                    'nombre': nombreController.text,
                    'correo': correoController.text,
                    'contraseña': passwordController.text,
                    'rol': rolController.text,
                  }),
                );

                if (response.statusCode == 201) {
                  _fetchUsuarios(); // Refresca la tabla
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Usuario agregado')),
                  );
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Error al agregar usuario')),
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
      appBar: AppBar(title: Text('Gestión de Usuarios')),
      body: Column(
        children: [
          ElevatedButton(
            onPressed: _showAddUserDialog,
            child: Text('Agregar Usuario'),
          ),
          Expanded(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: DataTable(
                columns: [
                  DataColumn(label: Text('ID')),
                  DataColumn(label: Text('Nombre')),
                  DataColumn(label: Text('Correo')),
                  DataColumn(label: Text('Rol')),
                  DataColumn(label: Text('Acciones')),
                ],
                rows: _usuarios.map((usuario) {
                  return DataRow(cells: [
                    DataCell(Text(usuario['idUsuario'].toString())),
                    DataCell(Text(usuario['nombre'])),
                    DataCell(Text(usuario['correo'])),
                    DataCell(Text(usuario['rol'])),
                    DataCell(Row(
                      children: [
                        IconButton(
                          icon: Icon(Icons.edit, color: Colors.orange),
                          onPressed: () {}, // Aquí puedes agregar la función de editar
                        ),
                        IconButton(
                          icon: Icon(Icons.delete, color: Colors.red),
                          onPressed: () => _deleteUsuario(usuario['idUsuario']),
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
