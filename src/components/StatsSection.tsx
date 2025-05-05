
import { Award, Users, Rocket } from "lucide-react";

const StatsSection = () => {
  return (
    <div className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Trusted by hackers worldwide
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Join thousands of developers discovering hackathons and forming winning teams
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col items-center">
              <div className="rounded-lg bg-hackmap-purple/10 p-4 mb-6">
                <Award className="h-8 w-8 text-hackmap-purple" />
              </div>
              <dt className="text-center text-2xl font-bold text-gray-900">
                50+ Hackathons
              </dt>
              <dd className="mt-4 text-center text-gray-500">
                Browse through our curated list of the best hackathons from around the world
              </dd>
            </div>
            <div className="flex flex-col items-center">
              <div className="rounded-lg bg-hackmap-blue/10 p-4 mb-6">
                <Users className="h-8 w-8 text-hackmap-blue" />
              </div>
              <dt className="text-center text-2xl font-bold text-gray-900">
                5,000+ Developers
              </dt>
              <dd className="mt-4 text-center text-gray-500">
                Connect with skilled developers that complement your abilities
              </dd>
            </div>
            <div className="flex flex-col items-center">
              <div className="rounded-lg bg-hackmap-purple/10 p-4 mb-6">
                <Rocket className="h-8 w-8 text-hackmap-purple" />
              </div>
              <dt className="text-center text-2xl font-bold text-gray-900">
                800+ Projects
              </dt>
              <dd className="mt-4 text-center text-gray-500">
                Great ideas transform into reality when the right team comes together
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
