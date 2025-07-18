'use client';

import { useEffect } from 'react';
import { useTour } from './tourProvider';
import { TourConfig, TourStep } from './tourRegistry';
import { useLocale } from 'next-intl';

// Extend your step type to include route information
interface ExtendedStep extends TourStep {
    route?: string | ((locale: string) => string);
}

export default function TourInitializer() {
    const { registerTour } = useTour();
    const locale = useLocale();

    useEffect(() => {
        console.log('TourInitializer: Registering tours');

        // Create steps with locale resolved
        const createTourSteps = (): ExtendedStep[] => {
            const isSpanish = locale === 'es';

            return [
                {
                    target: '[data-tour="all"]',
                    content: isSpanish
                        ? '¡Bienvenido a la comunidad! Descubre y comparte la vida sostenible.'
                        : 'Welcome to the community! Discover and share sustainable living.',
                    title: isSpanish
                        ? 'Navega por Greenteam'
                        : 'Navigate Greenteam',
                    placement: 'bottom',
                    disableBeacon: true,
                },
                {
                    target: '[data-tour="community"]',
                    content: isSpanish
                        ? 'Encuentra proyectos y grupos cerca de ti para caminar junt@s. ¡Si tienes tu proyecto no dudes en crear tu página!'
                        : 'Find projects and groups near you to walk together. If you have your own project, create your page!',
                    title: isSpanish
                        ? 'Buscador de Comunidad'
                        : 'Community Finder',
                    placement: 'bottom',
                },
                {
                    target: '[data-tour="favorites"]',
                    content: isSpanish
                        ? 'Sigue los proyectos, grupos y personas que más te inspiren, podrás ver su progreso en el feed de favoritos para mantenerte cerca de ellos.'
                        : 'Follow the projects, groups, and people that inspire you most. You\'ll see their progress in your favorites feed to stay close to them.',
                    title: isSpanish
                        ? 'Favoritos'
                        : 'Favorites',
                    placement: 'bottom',
                },
                {
                    target: '[data-tour="diamond"]',
                    content: isSpanish
                        ? 'Todos somos diferentes, pero buscamos lo mismo, BIENESTAR. Navega por los 6 claves del bienestar e inicia el camino a la sostenibilidad.'
                        : 'We\'re all different, but we seek the same thing: WELL-BEING. Explore the 6 keys to well-being and start your journey toward sustainability.',
                    title: isSpanish
                        ? 'Sumérgete ya en la sostenibilidad'
                        : 'Dive into sustainability now',
                    placement: 'top',
                },
                {
                    target: '[data-tour="greenChallenges"]',
                    content: isSpanish
                        ? 'Selecciona HACER para guardar publicaciones como RETOS. Cuando realices el reto, toma una foto y comparte tu experiencia. ¡Así es como junt@s sembramos CULTURA SOSTENIBLE!'
                        : 'Select DO to save posts as CHALLENGES. When you complete a challenge, take a photo and share your experience. That\'s how we grow a SUSTAINABLE CULTURE together!',
                    title: isSpanish
                        ? 'Si lo ves lo puedes hacer'
                        : 'If you see it, you can do it',
                    placement: 'top',
                },
                {
                    target: '[data-tour="points"]',
                    content: isSpanish
                        ? 'Puedes ver tu progreso, interacciones y retos personales en TU CAMINO SOSTENIBLE, ayudándote a avanzar de forma holística en este emocionante viaje.'
                        : 'You can track your progress, interactions, and personal challenges in YOUR SUSTAINABLE PATH, helping you to continue on this exciting journey.',
                    title: isSpanish
                        ? 'Crecimiento personal, social y ambiental'
                        : 'Personal, social, and environmental growth',
                    placement: 'bottom',
                },
                {
                    target: '[data-tour="invite"]',
                    content: isSpanish
                        ? 'Comparte GREENTEAM con tus amigos. ¡Gracias por participar!'
                        : 'Share GREENTEAM with your friends. Thank you for being part of it!',
                    title: isSpanish
                        ? 'Si te gusta la iniciativa'
                        : 'If you like the initiative',
                    placement: 'bottom',
                },
            ];
        };

        const headerTour: TourConfig = {
            id: 'header-tour',
            name: 'Platform Navigation Tour',
            autoStart: true,
            startDelay: 2000,
            showProgress: true,
            showSkipButton: true,
            continuous: true,
            steps: createTourSteps() as TourStep[],
        };

        // Register the tour
        registerTour(headerTour);

    }, [registerTour, locale]);

    return null;
}