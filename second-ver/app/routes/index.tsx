import { createRoute } from 'honox/factory';
import { HomePage } from '../components/templates/HomePage';
import { getRecentPosts } from '../lib/posts';
import { labsProjects } from '../lib/projects';
import { homeHeroContent, homePageSettings } from '../lib/homeContent';

export default createRoute((c) => {
  const latestPosts = getRecentPosts(3);
  return c.render(
    <HomePage
      latestPosts={latestPosts}
      projects={labsProjects}
      showClock={homePageSettings.showClock}
      heroContent={homeHeroContent}
    />
  );
});
