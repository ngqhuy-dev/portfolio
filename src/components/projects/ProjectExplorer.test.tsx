import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { projects } from '@/data/projects';
import { ProjectExplorer } from './ProjectExplorer';

function visibleTitles(listLabel = 'Project list') {
  const list = screen.getByLabelText(listLabel);
  return within(list)
    .getAllByRole('heading', { level: 3 })
    .map((heading) => heading.textContent);
}

describe('ProjectExplorer', () => {
  it('should show every project when the page loads', () => {
    render(<ProjectExplorer projects={projects} locale="en" />);
    expect(visibleTitles()).toHaveLength(projects.length);
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('should show only matching projects when a category filter is selected', async () => {
    render(<ProjectExplorer projects={projects} locale="en" />);
    await userEvent.click(screen.getByRole('button', { name: 'Mobile' }));

    const expected = projects.filter((p) => p.category === 'mobile').map((p) => p.title);
    expect(visibleTitles()).toEqual(expected);
    expect(screen.getByRole('button', { name: 'Mobile' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('should label private repositories instead of rendering a dead link', () => {
    render(<ProjectExplorer projects={projects} locale="en" />);
    const privateCount = projects.filter((p) => !p.github || p.github === '#').length;
    expect(screen.getAllByText('Private repository')).toHaveLength(privateCount);
  });

  it('should link every card to its case study under the locale prefix', () => {
    render(<ProjectExplorer projects={projects} locale="vi" />);
    const links = screen.getAllByRole('link', { name: /Xem chi tiết dự án/ });
    expect(links.map((link) => link.getAttribute('href'))).toEqual(
      projects.map((p) => `/vi/portfolio/${p.slug}`),
    );
  });

  it('should render Vietnamese labels and summaries when locale is vi', () => {
    render(<ProjectExplorer projects={projects} locale="vi" />);
    expect(screen.getByRole('button', { name: 'Tất cả' })).toBeInTheDocument();
    expect(visibleTitles('Danh sách dự án')).toHaveLength(projects.length);
    expect(screen.getByText(projects[0]?.summary.vi ?? '')).toBeInTheDocument();
  });
});
