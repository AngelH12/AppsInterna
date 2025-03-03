class ReporteVenta {
  final int? idReporte;
  final int idSucursal;
  final DateTime fecha;
  final double totalVentas;
  final int productosVendidos;

  ReporteVenta({
    this.idReporte,
    required this.idSucursal,
    required this.fecha,
    required this.totalVentas,
    required this.productosVendidos,
  });

  factory ReporteVenta.fromJson(Map<String, dynamic> json) {
    return ReporteVenta(
      idReporte: json['idReporte'],
      idSucursal: json['idSucursal'],
      fecha: DateTime.parse(json['fecha']),
      totalVentas: json['totalVentas'].toDouble(),
      productosVendidos: json['productosVendidos'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      "idSucursal": idSucursal,
      "fecha": fecha.toIso8601String(),
      "totalVentas": totalVentas,
      "productosVendidos": productosVendidos,
    };
  }
}
