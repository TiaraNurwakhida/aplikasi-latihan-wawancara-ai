import Navbar from "../Component/H_Header";
import Dimas from "../assets/dimas.png";
import Harry from "../assets/harry.jpg";
import Willy from "../assets/willy.jpg";
import CopyRight from "../Component/HSA_Footer";

function Home_Page() {
  return (
    <div className="bg-white bg-gradient-to-r from-purple-300 via-pink-200 to-white opacity-90">
      <Navbar />

      {/* HOME */}
      <div
        id="home"
        className="flex flex-col justify-center items-start min-h-screen px-8"
      >
        <h5 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
          Hello, welcome to
        </h5>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black mb-4">
          InterNeoAi
        </h1>

        <p className="text-lg sm:text-xl text-gray-700 mb-6">
          Experience Tailored Job Interview Simulations - Focused Practice with
          Customized Questions to Enhance Your Interview Skills!
        </p>

        <a
          href="/start"
          className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Start Now!
        </a>
      </div>

      {/* About Us */}
      <div
        id="about-us"
        className="min-h-screen px-4 sm:px-8 lg:px-16 xl:px-32 py-12 bg-transparent"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-center">
          About Us
        </h1>
        <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg">
          <p className="text-lg text-gray-700 leading-relaxed text-justify">
            <strong className="text-indigo-600">NeoAtten</strong> is dedicated
            to empowering individuals to overcome interview challenges by
            providing a platform for realistic, real-time interview simulations.
            Our mission is to support those who may feel anxious or unprepared
            by offering a tool to practice with customized questions and voice
            interactions. Founded with a vision to enhance talent growth among
            Indonesian youth, we utilize cutting-edge technology, including
            fine-tuned GPT-3.5, to offer personalized and adaptive practice
            experiences. Our platform is designed to mimic real interview
            scenarios, helping users build confidence, improve their
            communication skills, and prepare effectively for any interview
            situation. With features that allow users to receive feedback on
            their performance, NeoAtten aims to be the go-to resource for anyone
            looking to polish their interview skills, whether they are fresh
            graduates or experienced professionals looking to advance their
            careers. We are committed to continuously improving our platform and
            adapting to the evolving needs of our users, ensuring that they are
            always prepared to make a lasting impression in their interviews.
          </p>
        </div>
      </div>

      <CopyRight />
    </div>
  );
}

export default Home_Page;
