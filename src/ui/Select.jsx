import React from "react";
import styled from "styled-components";

const StyledSelect = styled.select`
  font-size: 1.4rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid
    ${(props) =>
      props.$type === "white"
        ? "var(--color-grey-100)"
        : "var(--color-grey-300)"};
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
`;

const Select = React.forwardRef(
  ({ options, value, onChange, emptyValue = false, ...props }, ref) => (
    <StyledSelect ref={ref} value={value} onChange={onChange} {...props}>
      {emptyValue && <option value="">Select</option>}
      {options.map(({ value, label, disabled = false }) => (
        <option value={value} key={value} disabled={disabled}>
          {label}
        </option>
      ))}
    </StyledSelect>
  )
);

Select.displayName = "Select";

export default Select;
