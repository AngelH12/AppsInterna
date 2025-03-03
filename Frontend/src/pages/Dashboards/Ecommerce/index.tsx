import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import BreadCrumb from "Common/BreadCrumb";
import { FaUtensils, FaChartLine, FaMoneyBillWave, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";

const dataVentas = [
  { name: "Enero", ventas: 4000 },
  { name: "Feb", ventas: 3000 },
  { name: "Mar", ventas: 5000 },
  { name: "Abr", ventas: 4500 },
];

const dataPlatos = [
  { name: "Churrasco", value: 35 },
  { name: "Tacos", value: 25 },
  { name: "Hamburguesa", value: 20 },
  { name: "Pupusas", value: 20 },
];

const dataLine = [
  { name: "Semana 1", ingresos: 5000, costos: 2000 },
  { name: "Semana 2", ingresos: 7000, costos: 2500 },
  { name: "Semana 3", ingresos: 8000, costos: 3000 },
  { name: "Semana 4", ingresos: 9000, costos: 4000 },
];

const COLORS = ["#FF8042", "#0088FE", "#FFBB28", "#00C49F"];


const Analytics = () => {
  return (
    <React.Fragment>
      <BreadCrumb title="Ecommerce" pageTitle="Dashboards" />

      <div className="grid grid-cols-12 gap-5 p-4">
        {[
          { icon: <FaChartLine className="text-blue-500 text-4xl" />, title: "Ventas Diarias", value: "Q. 5,200" },
          { icon: <FaMoneyBillWave className="text-green-500 text-4xl" />, title: "Ganancias Mensuales", value: "Q. 20,000" },
          { icon: <FaUtensils className="text-yellow-500 text-4xl" />, title: "Platos más vendidos", value: "Churrasco" },
          { icon: <FaTrash className="text-red-500 text-4xl" />, title: "Desperdicios", value: "Q. 500" },
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
      </div>
    </React.Fragment>
  );
};

export default Analytics;
