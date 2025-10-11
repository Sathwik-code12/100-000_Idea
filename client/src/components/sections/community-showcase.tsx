export default function CommunityShowcase() {
  const images = [
    {
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      alt: "Entrepreneur workspace"
    },
    {
      src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      alt: "Business planning"
    },
    {
      src: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      alt: "Creative team"
    },
    {
      src: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      alt: "Business success"
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Make Your Self</h2>
        <p className="text-gray-600 mb-12">
          Connect to the world where people start with <span className="font-bold">10000Ideas</span>
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <img
              key={index}
              src={image.src}
              alt={image.alt}
              className="rounded-lg w-full h-48 object-cover hover:scale-105 transition-transform cursor-pointer"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
