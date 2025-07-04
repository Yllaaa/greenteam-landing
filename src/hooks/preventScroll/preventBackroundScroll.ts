export const preventBackgroundScroll = (prevent: boolean): void => {
    if (prevent) {
      // Save the current scroll position
      const scrollY = window.scrollY;
      
      // Add styles to body to prevent scrolling while maintaining the scrollbar
      // to prevent layout shift
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflowY = 'scroll';
    } else {
      // Get the saved scroll position from body's top property
      const scrollY = document.body.style.top;
      
      // Remove the styles that prevented scrolling
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
      
      // Restore the scroll position
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  };
  
  export default preventBackgroundScroll;