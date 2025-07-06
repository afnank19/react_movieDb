import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { easeOut, motion, spring } from "framer-motion";

function FilmDetail() {
  let params = useParams();

  const [film, setFilm] = useState<any[]>([]);
  const [alert, setAlert] = useState("Add to Watchlist");
  const [Ralert, setRAlert] = useState("Remove from Watchlist");

  useEffect(() => {
    getCategory(params.detail);
  }, [params.detail]);

  const getCategory = async (name: string | undefined) => {
    try {
      const filmData = await fetch(
        `http://localhost:3000/movieDetail?q=${name}`
      );
      const filmJson = await filmData.json();

      setFilm(filmJson);
      console.log(filmJson);
    } catch (err) {
      console.log("Error occured when fetching movies");
    }
  };
  const AddtoWatchList = async () => {
    const loginItemLS = JSON.parse(
      localStorage.getItem("loginKey") || JSON.stringify("")
    );
    const addtoWL = await fetch(
      `http://localhost:3000/wishlist?q=${film[0].id}&u=${loginItemLS}`
    );
    setAlert("Added!");
    const aWLJson = await addtoWL.json();

    if (aWLJson[0].AWL_ERROR == "Record Already in wishlist table") {
      setAlert("Already Added :)");
    }
  };
  const RemoveFromWatchList = async () => {
    const loginItemLS = JSON.parse(
      localStorage.getItem("loginKey") || JSON.stringify("")
    );
    const rmvtoWL = await fetch(
      `http://localhost:3000/unwishlist?q=${film[0].id}&u=${loginItemLS}`
    );

    setRAlert("Removed!!");
    const rmvJson = await rmvtoWL.json();

    console.log(rmvJson[0].UWL_ERROR);
    if (rmvJson[0].UWL_ERROR == "No Record Found") {
      setRAlert("Already Removed :(");
      return;
    }
  };

  return (
    <>
      {film.map((movie) => (
        <div className="detail-card">
          <div className="detail-card detail-card-gradient"></div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.25,
              ease: [0, 0.79, 0.18, 1],
              type: spring,
            }}
            className="detail-card-content"
          >
            <motion.h1
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: "50%" }}
              transition={{ duration: 0.45, ease: easeOut, type: spring }}
              className="detail-card-text dc-title"
            >
              {movie.title}
            </motion.h1>
            <motion.h3
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: "0%" }}
              transition={{ duration: 0.6, ease: [0, 0.79, 0.18, 1] }}
              className="detail-card-text overview"
            >
              Overview:
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: "0%" }}
              transition={{ duration: 0.45, ease: [0, 0.79, 0.18, 1] }}
              className="detail-card-text overview-text"
            >
              {movie.overview}
              <br></br>
              <br></br>
              <span className="film-attributes">
                Score: ⭐{movie.score}
                &emsp;&emsp;&emsp;{movie.release_date.split("T")[0]}
                &emsp;&emsp;&emsp;Romance&emsp;&emsp;&emsp;
                {movie.runtime} min&emsp;&emsp;{movie.rating}
              </span>
              <br />
              <span className="film-attributes">
                {"Cast: " + movie.actor_names}
              </span>
            </motion.p>
            <a className="find-out detail-card-btn" href={movie.trailer_url}>
              Watch Trailer
            </a>
            <button
              className="find-out detail-card-btn watchlist-btn"
              onClick={AddtoWatchList}
            >
              {alert}
            </button>
            <button
              className="find-out detail-card-btn watchlist-btn"
              onClick={RemoveFromWatchList}
            >
              {Ralert}
            </button>
          </motion.div>

          <img src={movie.banner_url} className="detail-image"></img>
        </div>
      ))}
    </>
  );
}

export default FilmDetail;
