import { useState } from 'react';

export function useModalController() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    function openModal() {
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    return { isModalOpen, openModal, closeModal };
}
