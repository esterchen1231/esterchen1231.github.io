# Work & Apprenticeships logos

Add organization logos directly to this folder. The homepage displays organizations configured in `_data/worked_with.yml` first, in that order; additional supported image files follow in filename order after the site rebuilds. The section appears after Education and before Beyond work.

- Supported formats: SVG, PNG, JPG, JPEG, WebP, and AVIF. Uppercase extensions also work.
- Prefer a transparent SVG or PNG with little empty space around the logo. Choose a version intended for a white background; brand colors are preserved in both site themes.
- Use the organization’s name as the filename, such as `Company Name.svg` or `Company-Name.png`. This name also provides the image’s accessible text, so keep official capitalization and avoid abbreviations or numeric prefixes unless they are part of the name.
- Logos fit into consistent slots without being cropped or stretched. Files inside subfolders are not shown.
- Logos are displayed without links. Remove a logo file from this folder to remove it from the section.
- Optional metadata in `_data/worked_with.yml` supplies the official name, a short detail line, image dimensions, and source URLs. `background: navy` is used for the official white Johns Hopkins CTY wordmark.

The initial five logos were obtained from official institution websites. Exact sources are recorded in `_data/worked_with.yml`. The Museum London SVG was extracted from its official homepage without changing its path geometry. Brand colors are preserved. The Statistics Canada signature is not a navigation link, consistent with its [official logo/link guidance](https://www.statcan.gc.ca/en/terms-conditions/open-licence-faq).

This README is excluded from the published website in `_config.yml`.
