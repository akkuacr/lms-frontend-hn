import aboutMainImage from "../assets/Images/aboutMainImage.png";
import apj from "../assets/Images/QuotesPersonalityImage/apj.png";
import billGates from "../assets/Images/QuotesPersonalityImage/billGates.png";
import einstein from "../assets/Images/QuotesPersonalityImage/einstein.png";
import nelson from "../assets/Images/QuotesPersonalityImage/nelsonMandela.png";
import steveJobs from "../assets/Images/QuotesPersonalityImage/steveJobs.png";
import CarouselSlide from "../Components/CarouselSlide";

import HomeLayout from "../Layouts/HomeLayout";

function AboutUs() {
 
  const celebrities =[
    {
        title:"Nelson Mandela",
        description:" Remember that hope is a powerful weapon even when all is lost ",
        image:nelson,
        slideNumber:1
    },
    {
      title:"APJ Abdul Kalam",
      description:" If you want to shine like a sun , first burn like a sun ",
      image:apj,
      slideNumber:2
    },
    {
      title:"Albert Einstein",
      description:" Imagination is more important than knowledge  ",
      image:einstein,
      slideNumber:3
    },
    {
      title:"Steve Jobs",
      description:" Don't let the others opinions drawn out your inner voice  ",
      image:steveJobs,
      slideNumber:4
    },
    {
      title:"Bill gates",
      description:" Remember that hope is a powerful weapon even when all is lost ",
      image:billGates,
      slideNumber:5
  },

]
// console.log(celebrities.length);
 
 
  return (
    <HomeLayout>
      <div className="pl-20 pt-20 flex flex-col text-white  ">
        <div className="flex items-center gap-5 mx-10">
          <section className="w-1/2 space-y-10">
            <h1 className="text-5xl text-yellow-500 font-semibold">
              Affordable and quality education
            </h1>
            <p className="text-xl text-gray-200">
              Our Goal is to provide the affordable and quality education to the
              world. We are providing the platform for the aspiring teachers and
              students to share their skills,creativity and knowledge to each
              other to empower in the growth and wellness of mankind
            </p>
          </section>
          <div className="w-1/2">
            <img
              id="test1"
              style={{
                filter: "drop-shadow(0px 10px 10px rgb(0,0,0)",
              }}
              alt="about main image"
              className="drop-shadow-2xl"
              src={aboutMainImage}
            />
          </div>
        </div>

        {/* Carousel Start */}

        <div className="carousel w-1/2 my-16 m-auto ">
        console.log(celebrities.length);
          {celebrities && celebrities.map(celebrity =>(<CarouselSlide
                                                         {...celebrity}
                                                         key={celebrity.slideNumber}
                                                         totalSlides={celebrities.length}
                                                       /> ) ) }

        </div>

        {/* {Carousel end} */}
      </div>
    </HomeLayout>
  );
}

export default AboutUs;
