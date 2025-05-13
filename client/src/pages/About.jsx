import { Linkedin, Twitter } from "lucide-react";
import { useEffect , useState} from "react";
import { motion } from "framer-motion";

export default function About() {
  const [isPlaying, setIsPlaying] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll(".animate-on-scroll").forEach((el) => observer.observe(el));
  }, []);

  const founders = [
    {
      name: "Digvijay Naidu Atla",
      role: "Founder",
      img: "https://via.placeholder.com/100",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Gopi Krishna Davala",
      role: "Co-Founder",
      img: "https://via.placeholder.com/100",
      linkedin: "#",
      twitter: "#",
    },
  ];

  return (
    <section id="about" className="bg-black py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Section - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src="https://media-hosting.imagekit.io//9de7e2fdb89c4b7c/screenshot_1739162810669.png"
              alt="About us"
              className="rounded-lg shadow-lg w-full"
            />
          </motion.div>

          {/* Right Section - Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold text-white text-center mb-6">
              Our Mission & Values
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed text-center">
              Meet two young entrepreneurs dedicated to <strong>experiential learning</strong> in school education. They aim to <strong>enhance creativity, employability, and student learning</strong> while making education engaging and <strong>accessible to all Indian students</strong>. Their <strong>technology-driven</strong> platforms help bridge the gap between theory and practice, ensuring students are <strong>career-ready</strong>.
            </p>

            {/* Founder Details */}
            <div className="grid grid-cols-2 gap-6 mt-8">
              {founders.map((member, index) => (
                <div key={index} className="p-4 bg-gray-900 rounded-lg shadow text-center">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-20 h-20 mx-auto rounded-full mb-3 border-2 border-yellow-500"
                  />
                  <h3 className="text-2xl font-bold text-yellow-500">{member.name}</h3>
                  <p className="text-gray-300">{member.role}</p>
                  <div className="flex justify-center gap-4 mt-3">
                    <a href={member.linkedin} target="_blank" aria-label={`${member.name}'s LinkedIn`} className="text-blue-400 hover:text-blue-600">
                      <Linkedin size={22} />
                    </a>
                    <a href={member.twitter} target="_blank" aria-label={`${member.name}'s Twitter`} className="text-blue-300 hover:text-blue-500">
                      <Twitter size={22} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Fade-in animation */}
      <style>
        {`
          .fade-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
          }
        `}
      </style>
    </section>
  );
}