import React from "react";
import { Star } from "lucide-react";

function getSize(size: string) {
  if (size === "md") return "h-4 w-4";
  if (size === "lg") return "h-5 w-5";

  return "h3 w-3";
}

export default function StartRating({ average, size = "sm" }) {
  console.log("teste", average);
  if (!average) {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${getSize(size)} text-gray-400`}
            data-testid="star"
          />
        ))}
      </div>
    );
  }

  const average2 = (average / 10) * 5;

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((startNumber) => {
        const filterAmount = Math.max(
          0,
          Math.min(1, average2 - (startNumber - 1))
        );

        return (
          <div key={startNumber} className="relative">
            <div
              className="absolute top-0 left-0 overflow-hidden"
              style={{ width: `${filterAmount * 100}%` }}
            >
              <Star
                className={`${getSize(size)} text-yellow-400 fill-current`}
                data-testid="star"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
