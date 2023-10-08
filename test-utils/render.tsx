import { render as testingLibraryRender } from '@testing-library/react';
import ThemeProvider from '../src/theme/ThemeProvider';

export function render(ui: React.ReactNode) {
  return testingLibraryRender(<>{ui}</>, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    ),
  });
}
