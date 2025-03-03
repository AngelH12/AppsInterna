import 'package:app/pedidos_screen.dart';
import 'package:app/products_screen.dart';
import 'package:app/proveedores_screen.dart';
import 'package:app/reservas_screen.dart';
import 'package:flutter/material.dart';
import 'combos_screen.dart';
import 'envios_screen.dart';
import 'guarniciones_screen.dart';
import 'inventario_screen.dart';
import 'login_screen.dart';
import 'home_screen.dart';
import 'users_screen.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        debugShowCheckedModeBanner: false,
        title: 'Flutter App',
        theme: ThemeData(primarySwatch: Colors.blue),
        initialRoute: "/login",
        routes: {
          "/login": (context) => LoginScreen(),
          "/home": (context) => HomeScreen(),
          "/usuarios": (context) => UsersScreen(),
          "/productos": (context) => ProductsScreen(),
          "/combos": (context) => CombosScreen(),
          "/pedidos": (context) => PedidosScreen(),
          "/inventario": (context) => InventarioScreen(),
          "/proveedores": (context) => ProveedoresScreen(),
          "/reservas": (context) => ReservasScreen(),
          "/envios": (context) => EnviosScreen(),
            "/guarniciones": (context) => GuarnicionesScreen(),

        });
  }
}
