import css from "./App.module.css";
import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import {Toaster, toast} from "react-hot-toast";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Movie | null>(null);
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["query", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== "",
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if(isSuccess && data && data.results.length === 0) {
      toast.error("No movies found for your request.")
    }
  }, [isSuccess, data]);

  const totalPages = data?.total_pages ?? 0;
  const handleSearch = async (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

  return (
    <div className={css.app}>
      < Toaster />
      <SearchBar onSubmit={handleSearch} />
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {isSuccess && data.results.length > 0 && (
        <MovieGrid movies={data.results} onSelect={setSelected} />
      )}

      {selected && (
        <MovieModal movie={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
