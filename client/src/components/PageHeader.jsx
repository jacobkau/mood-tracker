
const PageHeader = ({ title, description }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white">{title}</h1>
        {description && (
          <p className="mt-4 text-xl text-indigo-100">{description}</p>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
