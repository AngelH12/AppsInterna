import React from "react";
import { useQuery } from '@tanstack/react-query';
import { ReportesService } from "services/service.cruds/Reportes/Reportes";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { FaChartLine, FaMoneyBillWave, FaUtensils, FaTrash } from "react-icons/fa";

const COLORS = ["#FF8042", "#0088FE", "#FFBB28", "#00C49F"];

const Analytics = () => {
  const { data } = useQuery({
    queryKey: ["reportes"],
    queryFn: ReportesService,
  });

  const reportes = Array.isArray(data) ? data : [];

  const ventasMensuales = reportes.reduce((acc: { [x: string]: any; }, reporte: { fecha: string | number | Date; totalVentas: any; }) => {
    const mes = new Date(reporte.fecha).toLocaleString("es-ES", { month: "short" }); 
    acc[mes] = (acc[mes] || 0) + reporte.totalVentas;
    return acc;
  }, {} as Record<string, number>);

  const dataVentas = Object.keys(ventasMensuales).map(mes => ({
    name: mes.charAt(0).toUpperCase() + mes.slice(1), 
    ventas: ventasMensuales[mes],
  }));

  const productosVendidos = reportes.reduce((acc: { [x: string]: any; }, reporte: { productosVendidos: any; }) => {
    acc["Productos"] = (acc["Productos"] || 0) + reporte.productosVendidos;
    return acc;
  }, {} as Record<string, number>);

  const dataPlatos = Object.keys(productosVendidos).map(plato => ({
    name: plato,
    value: productosVendidos[plato],
  }));

  const dataLine = reportes.map((reporte: { totalVentas: number; }, index: number) => ({
    name: `Semana ${index + 1}`,
    ingresos: reporte.totalVentas,
    costos: reporte.totalVentas * 0.4,
  }));

  const totalVentasDiarias = reportes.reduce((acc, reporte) => acc + (reporte.totalVentas || 0), 0);
  const totalProductosVendidos = reportes.reduce((acc, reporte) => acc + (reporte.productosVendidos || 0), 0);


  return (

    <><div className="grid grid-cols-12 gap-5 p-4">
      {[
        { icon: <FaChartLine className="text-blue-500 text-4xl" />, title: "Ventas Diarias", value: `Q. ${totalVentasDiarias.toLocaleString()}` },
        { icon: <FaMoneyBillWave className="text-green-500 text-4xl" />, title: "Ganancias Mensuales", value: `${totalProductosVendidos} productos` },
        { icon: <FaUtensils className="text-yellow-500 text-4xl" />, title: "Platos más vendidos", value: "Churrasco" },
      ].map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
          className="col-span-3 bg-white p-5 rounded-lg shadow-md flex items-center gap-4"
        >
          {card.icon}
          <div>
            <p className="text-gray-500 text-sm">{card.title}</p>
            <h3 className="text-xl font-bold">{card.value}</h3>
          </div>
        </motion.div>
      ))}
    </div><div className="grid grid-cols-12 gap-5 p-4">



        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="col-span-6 bg-white p-5 rounded-lg shadow-md"
        >
          <h2 className="text-lg font-bold mb-4">Ventas Mensuales</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataVentas}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="ventas" fill="#8884d8" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="col-span-6 bg-white p-5 rounded-lg shadow-md"
        >
          <h2 className="text-lg font-bold mb-4">Platos más vendidos</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={dataPlatos} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value">
                {dataPlatos.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="col-span-12 bg-white p-5 rounded-lg shadow-md"
        >
          <h2 className="text-lg font-bold mb-4">Ingresos vs Costos</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dataLine}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="ingresos" stroke="#0088FE" strokeWidth={2} />
              <Line type="monotone" dataKey="costos" stroke="#FF8042" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

      </div></>
  );
};

export default Analytics;
