import React from 'react'
import { FaInstagram, FaLinkedin, FaTwitter, FaPhone } from 'react-icons/fa';
import Header from '../components/Header'
import About from './About'

export default function Home() {
  const properties = [
    {
      id: 1,
      image: 'https://ap.rdcpix.com/523d3080250805d299aec06de4f3970dl-m2547209115od-w480_h360_x2.webp',
      title: 'Modern Apartment in City Center',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor neque in ante fermentum dapibus.',
    },
    {
      id: 2,
      image: 'https://ap.rdcpix.com/30942b3fa2c96947481d9f8c8050d35el-m2352547531od-w480_h360_x2.webp',
      title: 'Spacious Family Home with Garden',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor neque in ante fermentum dapibus.',
    },
    {
      id: 3,
      image: 'https://ap.rdcpix.com/773df21770e2dfcf3d103dfa2a89cde1l-m2772254422od-w480_h360_x2.webp',
      title: 'Luxury Villa with Ocean View',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor neque in ante fermentum dapibus.',
    },
    {
      id: 4,
      image: 'https://d21o7odkaa9pv4.cloudfront.net/b96651eec45236e894001151a5939a4852ecf8b4_md2.jpg',
      title: 'Cozy Countryside Cottage',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor neque in ante fermentum dapibus.',
    },
    {
      id: 5,
      image: 'https://ap.rdcpix.com/49e70c75ebe91fadf8c9629430a9eca7l-m2814270085od-w480_h360_x2.webp',
      title: 'Urban Loft in Trendy Neighborhood',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor neque in ante fermentum dapibus.',
    },
    {
      id: 6,
      image: 'https://ap.rdcpix.com/3350ecd78c62674e514bd9abff6457adl-m2247399525od-w480_h360_x2.webp',
      title: 'Elegant Townhouse in Historic District',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor neque in ante fermentum dapibus.',
    },
    {
      id: 7,
      image: 'https://ap.rdcpix.com/992ee7c7dfe24e1a132023f81a65527el-m2543379523od-w480_h360_x2.webp',
      title: 'Rustic Mountain Cabin with Stunning Views',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor neque in ante fermentum dapibus.',
    },
  ];
  return (
    <div>
      <Header/>
      <div>
      <section id="home" className="relative bg-cover bg-center py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent opacity-75"></div>
      <div className="container mx-auto relative z-10 text-center">
        <h1 className="text-5xl md:text-6xl text-white font-bold leading-tight mb-4">Welcome to our Real Estate Website</h1>
        <p className="text-lg text-white mb-8">Find your dream home with us</p>
        <a href="#properties" className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-full text-lg font-semibold transition duration-300 ease-in-out">View Properties</a>
      </div>
    </section>

    <section id="properties" className="py-16 m-2 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map(property => (
            <div key={property.id} className="group bg-white rounded-lg overflow-hidden shadow-md relative">
              <img src={property.image} alt={property.title} className="w-full h-64 object-cover object-center transition duration-300 ease-in-out transform group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-75 transition duration-300 ease-in-out"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">
                <div className="text-center text-white">
                  <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
                  <p className="text-gray-200">{property.description}</p>
                  <a href="#" className="block mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full text-center font-semibold transition duration-300 ease-in-out">View Property</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

  <section id="about" className="bg-gray-200 py-16 text-center">
    <div className="container mx-auto">
      <About/>
      <a href="#contact" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">Contact Us</a>
    </div>
  </section>

  <section id="contact" className="bg-gray-200 py-16 text-center">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8">Contact Us</h2>
        <p className="text-lg text-gray-700 mb-8">Get in touch with us for any inquiries or to schedule a viewing.</p>
        <div className="flex justify-center items-center space-x-4 mb-8">
          <a href="#" className="text-blue-500 hover:text-blue-600">
            <FaInstagram size={32} />
          </a>
          <a href="#" className="text-blue-500 hover:text-blue-600">
            <FaLinkedin size={32} />
          </a>
          <a href="#" className="text-blue-500 hover:text-blue-600">
            <FaTwitter size={32} />
          </a>
        </div>
        <p className="text-lg text-gray-700 mb-8">Customer Care Support: <a href="tel:+1234567890" className="text-blue-500 hover:text-blue-600"><FaPhone /> +1 (234) 567-890</a></p>
      </div>
    </section>

  <footer className="bg-gray-800 text-white py-4 text-center">
    <p>&copy; 2024 Real Estate Company. All rights reserved.</p>
  </footer>
      </div>
    </div>
  )
}
