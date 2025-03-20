function Card({ title, value, icon, color = "blue" }) {
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
    purple: "bg-purple-500",
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
      <div className={`${colorClasses[color]} p-3 rounded-full mr-4 text-white`}>{icon}</div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

export default Card;
