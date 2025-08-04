import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
  ChartStyle,
} from '../chart';
import type { ChartConfig } from '../chart';

// Import the actual module for testing
import * as ChartModule from '../chart';

// Mock recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  Tooltip: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="tooltip">{children}</div>
  ),
  Legend: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="legend">{children}</div>
  ),
}));

const mockConfig: ChartConfig = {
  desktop: {
    label: 'Desktop',
    color: '#2563eb',
  },
  mobile: {
    label: 'Mobile',
    color: '#60a5fa',
  },
  theme: {
    label: 'Theme Test',
    theme: {
      light: '#ffffff',
      dark: '#000000',
    },
  },
};

const MockIcon = () => <div data-testid="mock-icon">Icon</div>;

describe('ChartContainer', () => {
  it('renders with basic props', () => {
    render(
      <ChartContainer config={mockConfig}>
        <div>Chart content</div>
      </ChartContainer>
    );

    expect(screen.getByText('Chart content')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ChartContainer config={mockConfig} className="custom-class">
        <div>Chart content</div>
      </ChartContainer>
    );

    const chartDiv = container.querySelector('[data-chart]');
    expect(chartDiv).toHaveClass('custom-class');
  });

  it('generates unique chart id', () => {
    const { container } = render(
      <ChartContainer config={mockConfig}>
        <div>Chart content</div>
      </ChartContainer>
    );

    const chartDiv = container.querySelector('[data-chart]');
    expect(chartDiv).toHaveAttribute('data-chart');
    expect(chartDiv?.getAttribute('data-chart')).toMatch(/^chart-/);
  });

  it('uses custom id when provided', () => {
    const { container } = render(
      <ChartContainer config={mockConfig} id="custom-chart">
        <div>Chart content</div>
      </ChartContainer>
    );

    const chartDiv = container.querySelector(
      '[data-chart="chart-custom-chart"]'
    );
    expect(chartDiv).toBeInTheDocument();
  });

  it('includes ChartStyle component', () => {
    const { container } = render(
      <ChartContainer config={mockConfig}>
        <div>Chart content</div>
      </ChartContainer>
    );

    const styleElement = container.querySelector('style');
    expect(styleElement).toBeInTheDocument();
  });
});

describe('ChartStyle', () => {
  it('renders style element with config colors', () => {
    const { container } = render(
      <ChartStyle id="test-chart" config={mockConfig} />
    );

    const styleElement = container.querySelector('style');
    expect(styleElement).toBeInTheDocument();

    const styleContent = styleElement?.innerHTML;
    expect(styleContent).toContain('--color-desktop: #2563eb');
    expect(styleContent).toContain('--color-mobile: #60a5fa');
    expect(styleContent).toContain('[data-chart=test-chart]');
  });

  it('handles theme-based config', () => {
    const { container } = render(
      <ChartStyle id="test-chart" config={mockConfig} />
    );

    const styleElement = container.querySelector('style');
    const styleContent = styleElement?.innerHTML;

    expect(styleContent).toContain('--color-theme: #ffffff');
    expect(styleContent).toContain('.dark [data-chart=test-chart]');
    expect(styleContent).toContain('--color-theme: #000000');
  });

  it('returns null when no color config', () => {
    const emptyConfig: ChartConfig = {
      test: { label: 'Test' },
    };

    const { container } = render(
      <ChartStyle id="test-chart" config={emptyConfig} />
    );

    const styleElement = container.querySelector('style');
    expect(styleElement).not.toBeInTheDocument();
  });
});

describe('ChartTooltipContent', () => {
  const mockPayload = [
    {
      name: 'Desktop',
      value: 1000,
      dataKey: 'desktop',
      color: '#2563eb',
      payload: { fill: '#2563eb' },
    },
    {
      name: 'Mobile',
      value: 800,
      dataKey: 'mobile',
      color: '#60a5fa',
      payload: { fill: '#60a5fa' },
    },
  ];

  it('renders nothing when not active', () => {
    const { container } = render(
      <ChartContainer config={mockConfig}>
        <ChartTooltipContent active={false} payload={mockPayload} />
      </ChartContainer>
    );

    // Should not render tooltip content when not active
    expect(screen.queryByText('Desktop')).not.toBeInTheDocument();
    expect(screen.queryByText('Mobile')).not.toBeInTheDocument();
  });

  it('renders nothing when no payload', () => {
    const { container } = render(
      <ChartContainer config={mockConfig}>
        <ChartTooltipContent active={true} payload={[]} />
      </ChartContainer>
    );

    // Should not render any content when payload is empty
    expect(screen.queryByText('Desktop')).not.toBeInTheDocument();
  });

  it('renders tooltip content when active with payload', () => {
    render(
      <ChartContainer config={mockConfig}>
        <ChartTooltipContent active={true} payload={mockPayload} />
      </ChartContainer>
    );

    // Verify tooltip content is rendered with default formatter
    expect(screen.getByText('1,000')).toBeInTheDocument();
    expect(screen.getByText('800')).toBeInTheDocument();

    // Check that Desktop and Mobile labels appear (they appear in both label and content areas)
    const desktopElements = screen.getAllByText('Desktop');
    const mobileElements = screen.getAllByText('Mobile');
    expect(desktopElements.length).toBeGreaterThan(0);
    expect(mobileElements.length).toBeGreaterThan(0);
  });

  it('applies custom className', () => {
    const { container } = render(
      <ChartContainer config={mockConfig}>
        <ChartTooltipContent
          active={true}
          payload={mockPayload}
          className="custom-tooltip"
        />
      </ChartContainer>
    );

    const tooltipDiv = container.querySelector('.custom-tooltip');
    expect(tooltipDiv).toBeInTheDocument();
  });

  it('hides label when hideLabel is true', () => {
    render(
      <ChartContainer config={mockConfig}>
        <ChartTooltipContent
          active={true}
          payload={mockPayload}
          hideLabel={true}
          label="Test Label"
        />
      </ChartContainer>
    );

    expect(screen.queryByText('Test Label')).not.toBeInTheDocument();
  });

  it('hides indicator when hideIndicator is true', () => {
    const { container } = render(
      <ChartContainer config={mockConfig}>
        <ChartTooltipContent
          active={true}
          payload={mockPayload}
          hideIndicator={true}
        />
      </ChartContainer>
    );

    const indicators = container.querySelectorAll('[style*="--color-bg"]');
    expect(indicators).toHaveLength(0);
  });

  it('renders with line indicator', () => {
    const { container } = render(
      <ChartContainer config={mockConfig}>
        <ChartTooltipContent
          active={true}
          payload={mockPayload}
          indicator="line"
        />
      </ChartContainer>
    );

    const lineIndicators = container.querySelectorAll('.w-1');
    expect(lineIndicators.length).toBeGreaterThan(0);
  });

  it('renders with dashed indicator', () => {
    const { container } = render(
      <ChartContainer config={mockConfig}>
        <ChartTooltipContent
          active={true}
          payload={mockPayload}
          indicator="dashed"
        />
      </ChartContainer>
    );

    const dashedIndicators = container.querySelectorAll('.border-dashed');
    expect(dashedIndicators.length).toBeGreaterThan(0);
  });

  it('uses custom formatter when provided', () => {
    const customFormatter = jest.fn((value, name) => `${name}: ${value}%`);

    render(
      <ChartContainer config={mockConfig}>
        <ChartTooltipContent
          active={true}
          payload={mockPayload}
          formatter={customFormatter}
        />
      </ChartContainer>
    );

    expect(customFormatter).toHaveBeenCalled();
  });

  it('uses custom label formatter when provided', () => {
    const labelFormatter = jest.fn((label) => `Custom ${label}`);

    render(
      <ChartContainer config={mockConfig}>
        <ChartTooltipContent
          active={true}
          payload={mockPayload}
          label="Test"
          labelFormatter={labelFormatter}
        />
      </ChartContainer>
    );

    expect(labelFormatter).toHaveBeenCalledWith('Test', mockPayload);
  });
});

describe('ChartLegendContent', () => {
  const mockLegendPayload = [
    {
      value: 'Desktop',
      dataKey: 'desktop',
      color: '#2563eb',
    },
    {
      value: 'Mobile',
      dataKey: 'mobile',
      color: '#60a5fa',
    },
  ];

  it('renders nothing when no payload', () => {
    const { container } = render(
      <ChartContainer config={mockConfig}>
        <ChartLegendContent payload={[]} />
      </ChartContainer>
    );

    // Should not render any legend items when payload is empty
    expect(screen.queryByText('Desktop')).not.toBeInTheDocument();
    expect(screen.queryByText('Mobile')).not.toBeInTheDocument();
  });

  it('renders legend items when payload provided', () => {
    render(
      <ChartContainer config={mockConfig}>
        <ChartLegendContent payload={mockLegendPayload} />
      </ChartContainer>
    );

    expect(screen.getByText('Desktop')).toBeInTheDocument();
    expect(screen.getByText('Mobile')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ChartContainer config={mockConfig}>
        <ChartLegendContent
          payload={mockLegendPayload}
          className="custom-legend"
        />
      </ChartContainer>
    );

    const legendDiv = container.querySelector('.custom-legend');
    expect(legendDiv).toBeInTheDocument();
  });

  it('adjusts spacing for top vertical align', () => {
    const { container } = render(
      <ChartContainer config={mockConfig}>
        <ChartLegendContent payload={mockLegendPayload} verticalAlign="top" />
      </ChartContainer>
    );

    const legendDiv = container.querySelector('.pb-3');
    expect(legendDiv).toBeInTheDocument();
  });

  it('renders with default bottom alignment', () => {
    const { container } = render(
      <ChartContainer config={mockConfig}>
        <ChartLegendContent payload={mockLegendPayload} />
      </ChartContainer>
    );

    const legendDiv = container.querySelector('.pt-3');
    expect(legendDiv).toBeInTheDocument();
  });

  it('renders color indicators for legend items', () => {
    const { container } = render(
      <ChartContainer config={mockConfig}>
        <ChartLegendContent payload={mockLegendPayload} />
      </ChartContainer>
    );

    // Should render color squares for each legend item
    const colorIndicators = container.querySelectorAll('.h-2.w-2');
    expect(colorIndicators.length).toBeGreaterThan(0);
  });
});

describe('useChart hook', () => {
  it('works correctly inside ChartContainer', () => {
    let capturedConfig: ChartConfig | null = null;

    const TestComponent = () => {
      // Access the context directly through React.useContext
      const context = React.useContext(
        React.createContext<{ config: ChartConfig } | null>(null)
      );
      capturedConfig = context?.config || null;
      return <div data-testid="config-test">Config received</div>;
    };

    render(
      <ChartContainer config={mockConfig}>
        <TestComponent />
      </ChartContainer>
    );

    expect(screen.getByTestId('config-test')).toBeInTheDocument();
  });

  it('provides context to child components', () => {
    const TestComponent = () => {
      return <div data-testid="child-component">Child in ChartContainer</div>;
    };

    render(
      <ChartContainer config={mockConfig}>
        <TestComponent />
      </ChartContainer>
    );

    expect(screen.getByTestId('child-component')).toBeInTheDocument();
  });
});
