import React from 'react';
import axios from 'axios';
import Movie from '../components/Movie';
import './Home.css';

class Home extends React.Component {
  state = {
    isLoading: true,
    movies: [],
  };
  getMovies = async () => {
    const {
      data: {
        data: { movies },
      },
    } =  await axios.get('https://pfvj29yvkb.execute-api.ap-northeast-2.amazonaws.com/Production');
    // 람다로 만든 API URL : 웹브라우저에서는 작동하는데 소스에 넣으면 시간이 오래 걸리고 있음 - 구조 재확인 필요 : AWS API Gateway의 CORS 설정 변경 4XX 등
    // https://pfvj29yvkb.execute-api.ap-northeast-2.amazonaws.com/Production 
    // await axios.get('https://yts-proxy.now.sh/list_movies.json?sort_by=rating');
    this.setState({ movies, isLoading: false });
  };
  componentDidMount() {
    this.getMovies();
  }
  render() {
    console.log(this.state);
    const { isLoading, movies } = this.state;
    return (
      <section className="container">
        {isLoading ? (
          <div className="loader">
            <span className="loader__text">Loading...</span>
          </div>
        ) : (
          <div className="movies">
            {movies.map((movie) => {
              return (
                <Movie
                  key={movie.id}
                  content_id={movie.id.toString()}
                  year={movie.year}
                  title={movie.title}
                  summary={movie.summary}
                  poster={movie.medium_cover_image}
                  genres={movie.genres}
                />
              );
            })}
          </div>
        )}
      </section>
    );
  }
}

export default Home;
