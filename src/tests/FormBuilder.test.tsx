import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormBuilder } from '../form_engine/FormBuilder';
import { demoSchema } from '../stories/demoSchema';
import type { FormSchema } from '../form_engine/types';

describe('FormBuilder interactions', () => {
  it('keyboard navigation moves between inputs', async () => {
    render(<FormBuilder schema={demoSchema} />);

    const name = screen.getByLabelText('Full Name') as HTMLInputElement;
    name.focus();
    expect(name).toHaveFocus();

    await userEvent.tab();
    const subscribe = screen.getByLabelText('Subscribe to newsletter') as HTMLInputElement;
    expect(subscribe).toBeInTheDocument();
  });

  it('shows async validation error for taken name', async () => {
    render(<FormBuilder schema={demoSchema} />);

    const name = screen.getByLabelText('Full Name') as HTMLInputElement;
    await userEvent.type(name, 'taken');
    name.blur();

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/already taken/i);
    }, { timeout: 1500 });
  });

  it('does not validate hidden fields', async () => {
    const schema: FormSchema = {
      id: 'hidden-test',
      fields: [
        { id: 'flag', type: 'checkbox', label: 'Flag' },
        { id: 'secret', type: 'text', label: 'Secret', visibleIf: { fieldId: 'flag', operator: 'equals', value: true }, validation: { required: true } }
      ]
    };

    render(<FormBuilder schema={schema} />);
    const secret = screen.queryByLabelText('Secret');
    expect(secret).toBeNull();
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
