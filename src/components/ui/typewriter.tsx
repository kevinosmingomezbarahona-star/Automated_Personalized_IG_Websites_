import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const Typewriter = ({
    text,
    speed = 50,
    waitTime = 2000,
    className = '',
}: {
    text: string | string[];
    speed?: number;
    waitTime?: number;
    className?: string;
}) => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        const textsArray = Array.isArray(text) ? text : [text];
        const fullText = textsArray[currentTextIndex];

        const handleType = () => {
            setCurrentText(
                isDeleting
                    ? fullText.substring(0, currentText.length - 1)
                    : fullText.substring(0, currentText.length + 1)
            );

            let typeSpeed = speed;
            if (isDeleting) typeSpeed /= 2;

            if (!isDeleting && currentText === fullText) {
                typeSpeed = waitTime;
                setIsDeleting(true);
            } else if (isDeleting && currentText === '') {
                setIsDeleting(false);
                setCurrentTextIndex((prev) => (prev + 1) % textsArray.length);
                typeSpeed = speed;
            }

            timeout = setTimeout(handleType, typeSpeed);
        };

        timeout = setTimeout(handleType, speed);
        return () => clearTimeout(timeout);
    }, [currentText, isDeleting, currentTextIndex, speed, text, waitTime]);

    return (
        <span className={className}>
            {currentText}
            <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
            >
                |
            </motion.span>
        </span>
    );
};
