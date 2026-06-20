import React from "react";
import { useSelector } from "react-redux";
import styles from "../../styles/styles";
import EventCard from "./EventCard";

const Events = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);

  return (
    <div className="bg-gradient-to-b from-white to-blue-50 py-12">
      {!isLoading && (
        <div className={`${styles.section}`}>
          {/* Heading */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-700 relative inline-block">
              Popular Events
              <span className="absolute left-0 -bottom-2 w-full h-[3px] bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></span>
            </h1>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              Stay updated with our trending events 
            </p>
          </div>

          {/* Events Grid */}
          <div className="w-full flex justify-center">
            {allEvents && allEvents.length !== 0 ? (
              <EventCard data={allEvents[0]} />
            ) : (
              <div className="text-center py-10">
                <h4 className="text-gray-500 text-lg">
                  🚫 No events available right now. Check back soon!
                </h4>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
