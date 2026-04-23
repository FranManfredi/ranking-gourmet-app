"use client";

import { useState } from "react";
import IconButton from "@/src/components/button/IconButton";
import RestaurantFormModal from "@/src/components/modal/RestaurantFormModal";
import EvaluatorFormModal from "@/src/components/modal/EvaluatorFormModal";


export default function RestaurantsAndEvaluatorButtonWrapper() {
    const [isEvaluatorModalOpen, setIsEvaluatorModalOpen] = useState(false);
    const [isRestaurantModalOpen, setIsRestaurantModalOpen] = useState(false);

    return (
        <>
            <div className="flex w-full items-center justify-center gap-4 px-4">
                <IconButton
                    label="RESTAURANTES"
                    icon="/tabler_plus.svg"
                    variant="default"
                    onClick={() => setIsRestaurantModalOpen(true)}
                />

                <IconButton
                    label="EVALUADORES"
                    icon="/octicon_person-add-16.svg"
                    variant="default"
                    onClick={() => setIsEvaluatorModalOpen(true)}
                />
            </div>

            <RestaurantFormModal
                open={isRestaurantModalOpen}
                onClose={() => setIsRestaurantModalOpen(false)}
            />

            <EvaluatorFormModal
                open={isEvaluatorModalOpen}
                onClose={() => setIsEvaluatorModalOpen(false)}
            />
        </>
    );
}