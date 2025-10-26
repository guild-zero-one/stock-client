"use client";

import { searchMultipleImages } from "@/api/serpapi/services/SearchService";
import { useCallback, useEffect, useRef, useState } from "react";
import Button from "../button";
import Modal from "../modal-popup";

interface SearchImage {
    thumbnail?: string;
    original?: string;
    title?: string;
}

interface ImagePickerModalProps {
    openModal: boolean;
    searchQuery: any;
    extraQuery: string;
    onImageSelect?: (url: string) => void;
    onClose?: () => void;
}

export default function ModalSearchImage({
    openModal = false,
    searchQuery,
    extraQuery,
    onImageSelect,
    onClose
}: ImagePickerModalProps) {
    const [images, setImages] = useState<SearchImage[]>([]);
    const [loadingImages, setLoadingImages] = useState(false);
    const [imagesPage, setImagesPage] = useState(0);
    const [hasMoreImages, setHasMoreImages] = useState(true);
    
    const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
    
    useEffect(() => {
        if (openModal) {
            setImages([]);
            setImagesPage(0);
            setHasMoreImages(true);
            fetchImages(true);
        }
    }, [openModal, searchQuery, extraQuery]);
    // Função para buscar imagens
    const fetchImages = useCallback(async (reset = false) => {
        if (loadingImages || (!hasMoreImages && !reset)) return;
        setLoadingImages(true);

        try {
            const pageToFetch = reset ? 0 : imagesPage;
            const imgs = await searchMultipleImages(searchQuery + " " + extraQuery, 9, pageToFetch);
            if (imgs.length < 9) setHasMoreImages(false);
            if (reset) {
                setImages(imgs);
                setImagesPage(1);
            } else {
                setImages(prev => [...prev, ...imgs]);
                setImagesPage(prev => prev + 1);
            }

        } catch (e) {
            setHasMoreImages(false);
        } finally {
            setLoadingImages(false);
        }
    }, [searchQuery, imagesPage, loadingImages, hasMoreImages]);


    // Handler de scroll do grid
    const handleModalScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
        
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }
        
        scrollTimeoutRef.current = setTimeout(() => {
            if (scrollHeight - scrollTop <= clientHeight + 100) {
                fetchImages();
            }
        }, 200);
    };

    const handleClose = () => {
        if (onClose) onClose();
    };

    const handleSelectImage = (img: any) => {
        const chosen = img.thumbnail || img.original || "";
        if (onImageSelect) onImageSelect(chosen);
        if (onClose) onClose();
    };
    return (
        <>
            <Modal
                open={openModal}
                onClose={handleClose}
                title={<span>Escolha uma imagem</span>}
                body={
                    <div
                        className="w-full hide-scrollbar max-h-[60vh] overflow-y-auto"
                        onScroll={handleModalScroll}
                    >
                        <div className="grid grid-cols-3 gap-2 p-2">
                            {images.filter(i => i && (i.thumbnail || i.original)).map((img, idx) => (
                                <button
                                    key={`${img.original || 'img'}-${idx}`}
                                    className="aspect-square border rounded overflow-hidden hover:ring-2 hover:ring-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white w-full border-gray-dark"
                                    type="button"
                                    onClick={() => handleSelectImage(img)}
                                    tabIndex={0}
                                >
                                    <img
                                        src={img.thumbnail || img.original}
                                        alt={img.title || "Imagem"}
                                        className="w-full h-full object-contain"
                                        onError={(e) => e.currentTarget.src = ""}
                                    />
                                </button>
                            ))}
                        </div>
                        {loadingImages && (
                            <div className="text-center py-2 text-gray-500">Carregando...</div>
                        )}
                        {!loadingImages && images.length === 0 && (
                            <div className="text-center py-2 text-gray-500">Nenhuma imagem encontrada</div>
                        )}
                    </div>
                }
                footer={
                    <Button label="Cancelar" fullWidth variant="outlined" onClick={handleClose} />
                }
            />
        </>
    )
}
