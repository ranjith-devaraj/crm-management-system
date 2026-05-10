type Props = {
  title: string;
  value: string | number;
  icon?: string;
};

export default function Card({ title, value, icon }: Props) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition flex items-center justify-between">
      
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>

      {icon && (
        <div className="text-3xl opacity-70">
          {icon}
        </div>
      )}
    </div>
  );
}