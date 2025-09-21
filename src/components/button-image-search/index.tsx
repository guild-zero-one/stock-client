"use client";

import {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback
} from "react";

import { search } from "@/api/serpapi/services/SearchService";

interface ButtonImageSearchProps {
  onSelect: (url: string) => void;
  label?: string;
  searchTerm: string;
  type: string;
  disabled?: boolean;
  onValidationError?: () => void;
  onImageError?: () => void;
}

export interface ButtonImageSearchRef {
  handleImageError: () => void;
}

interface SearchResult {
  images_results?: Array<{ original: string }>;
}

export const ButtonImageSearch = forwardRef<ButtonImageSearchRef, ButtonImageSearchProps>(
  (
    {
      onSelect,
      label = "Buscar Imagens",
      searchTerm,
      type,
      disabled = false,
      onValidationError,
      onImageError,
    },
    ref
  ) => {
    const [isSearching, setIsSearching] = useState(false);
    const [allImages, setAllImages] = useState<string[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [hasImageLoaded, setHasImageLoaded] = useState(true);
    const previousSearchTerm = useRef("");

    const searchTypeMap: Record<string, string> = {
      Marca: " logo filetype:png",
      Produto: " filetype:png",
    };

    const validateSearchTerm = useCallback(() => {
      if (!searchTerm.trim()) {
        onValidationError?.();
        return false;
      }
      return true;
    }, [searchTerm, onValidationError]);

    const handleImageError = useCallback(() => {
      setHasImageLoaded(false);
      onImageError?.();

      if (currentImageIndex < allImages.length - 1) {
        // Try next image in current search results
        const nextIndex = currentImageIndex + 1;
        setCurrentImageIndex(nextIndex);
        setHasImageLoaded(true);
        onSelect(allImages[nextIndex]);
      } else {
        // No more images, perform new search
        fetchImages();
      }
    }, [currentImageIndex, allImages, onSelect, onImageError]);

    useImperativeHandle(ref, () => ({
      handleImageError,
    }));

    const fetchImages = useCallback(async () => {
      if (!validateSearchTerm()) return;

      setIsSearching(true);

      try {
        const searchQuery = searchTerm.trim() + (searchTypeMap[type] || "");
        const result: SearchResult = await search(searchQuery);
        
        const images = result.images_results?.map(img => img.original) || [];
        
        setAllImages(images);
        setCurrentImageIndex(0);
        setHasImageLoaded(true);

        if (images[0]) {
          onSelect(images[0]);
        }
      } catch (error) {
        console.error("Erro na busca de imagens:", error);
      } finally {
        setIsSearching(false);
      }
    }, [searchTerm, type, onSelect, validateSearchTerm]);

    const showNextImage = useCallback(() => {
      if (currentImageIndex < allImages.length - 1) {
        const nextIndex = currentImageIndex + 1;
        setCurrentImageIndex(nextIndex);
        setHasImageLoaded(true);
        onSelect(allImages[nextIndex]);
      } else {
        fetchImages();
      }
    }, [currentImageIndex, allImages, onSelect, fetchImages]);

    const handleButtonClick = useCallback(() => {
      if (allImages.length > 0) {
        showNextImage();
      } else {
        fetchImages();
      }
    }, [allImages.length, showNextImage, fetchImages]);

    useEffect(() => {
      if (searchTerm !== previousSearchTerm.current && searchTerm.trim()) {
        previousSearchTerm.current = searchTerm;
        setAllImages([]);
        setCurrentImageIndex(0);
        setHasImageLoaded(true);
      }
    }, [searchTerm]);

    const getButtonText = () => {
      if (isSearching) return "Buscando...";
      if (allImages.length > 0) return "Próxima imagem";
      return label;
    };

    const isButtonDisabled = disabled || isSearching;

    return (
      <div className="relative flex flex-col items-start gap-2 w-fit h-fit">
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={isButtonDisabled}
          className={`px-4 py-2 rounded-md font-lexend text-sm cursor-pointer transition-colors ${
            isButtonDisabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-pink-default hover:bg-pink-hovered text-white"
          }`}
          aria-label={getButtonText()}
        >
          {getButtonText()}
        </button>
      </div>
    );
  }
);
