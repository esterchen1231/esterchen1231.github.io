# Miami Beach Calendar and Unavailable-Time Tooltips

## Goal

Improve the `/book-a-meeting/` page so short unavailable blocks remain understandable and the entire page has a cohesive Miami Beach visual identity.

## Visual Direction

Use a soft Miami Beach palette rather than a neon treatment:

- warm sand and pale sunrise backgrounds;
- turquoise and aqua for interactive and calendar elements;
- coral for highlights and focus accents;
- deep ocean navy for readable text;
- white or near-white elevated surfaces.

Apply the palette across the hero, control panel, form controls, legend, status messages, calendar, unavailable blocks, and contact panel. Preserve adequate text contrast and provide coordinated dark-theme colors.

## Unavailable-Time Details

Each unavailable or pending block will expose its full details through one reusable custom tooltip. The tooltip will show:

- the block status, such as `Busy` or `Request pending`;
- the complete local date and start/end time;
- the currently selected display timezone.

The block's compact inline text remains unchanged so taller blocks still communicate information without interaction. The tooltip appears when a block is hovered with a pointer or focused from the keyboard, and disappears on pointer leave, focus loss, Escape, calendar re-render, or viewport scrolling/resizing.

## Interaction and Accessibility

Unavailable blocks become keyboard-focusable and receive an accessible label containing the same complete details as the tooltip. The tooltip uses `role="tooltip"`, and the active block references it with `aria-describedby`.

Pending-request delete buttons retain their existing behavior. Focusing the delete button does not hide the parent block's tooltip until focus leaves the block. Clicking unavailable blocks continues to avoid triggering meeting selection.

The tooltip is rendered outside the clipped calendar blocks and positioned in viewport coordinates. It prefers placement above the block, falls below when necessary, and clamps horizontally to the viewport so it stays readable at calendar and screen edges. It does not capture pointer events.

## Implementation Boundaries

Keep the change scoped to `_pages/book-a-meeting.html`:

- extend the page-scoped CSS variables and component styles for the Miami Beach palette;
- add one tooltip element near the calendar shell;
- add small JavaScript helpers for tooltip content, positioning, visibility, and cleanup;
- connect those helpers while rendering unavailable blocks.

Do not modify `_data/meeting_unavailability.yml`, meeting-selection logic, timezone conversion, weekly repetition, pending-request storage, or email drafting.

## Error Handling

If a rendered block lacks valid dates, existing rendering validation continues to skip it. If tooltip positioning cannot obtain a usable block rectangle, the tooltip remains hidden. Calendar rendering and booking remain functional without the tooltip.

## Verification

- Build the Jekyll site successfully.
- Confirm every unavailable and pending block shows complete details on hover.
- Confirm keyboard focus shows the same tooltip and Escape dismisses it.
- Confirm the tooltip stays within the viewport for blocks near the top, left, and right edges.
- Confirm timezone changes update tooltip content.
- Confirm pending-request deletion and available-slot selection still work.
- Check desktop and narrow horizontal-scroll layouts.
- Check light and dark themes for contrast and visual consistency.

## Out of Scope

- Changes to the source calendar or its schedule.
- Touch-triggered persistent popovers.
- New booking, storage, or calendar-sync behavior.
- A site-wide theme change outside `/book-a-meeting/`.
