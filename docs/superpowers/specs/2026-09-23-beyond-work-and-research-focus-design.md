# Beyond work and research focus

## Scope and chosen design

The user requested a personal photo strip at the very bottom of the homepage, based on the Beyond work section at https://qingxiaozheng.com/about and their attached screenshot. Use the requested moving-photo design within the existing site's layout and day/night palette. Add a photo folder that the user can populate later. Do not publish other people's photos or invent personal photographs.

Compared with a static grid or a click-through carousel, continuous horizontal strips most closely match the supplied reference. The latest request uses three balanced rows with alternating directions for nine or more photos, two rows for six to eight photos, and one row for smaller collections. On hover, pause motion and enlarge a photo by no more than four percent. Include a pause control. Reduced-motion visitors receive static, horizontally scrollable rows; no-JavaScript visitors retain the original scrollable strip.

Keep the existing body typography and section alignment. Reuse the site's cream surface (#fffdf7), deep blue text (#123b52), muted blue (#527383), pale turquoise border (#b9dedc), and coral accent (#b43f3c), with the existing dark-theme equivalents. The photo strip is the visual focus; avoid adding new badges, decorative labels, or unrelated page changes.

## Content

The top introduction presents human–AI interaction for sensemaking and decision-making as the broader research focus. A separate paragraph frames visual representations and interactive systems as developing Ph.D. interests, rather than an established dissertation title or a description of every past publication. At the user's request, remove human cognition as an umbrella label to better reflect her mathematics and computer engineering background. The paragraph includes knowledge work, metacognition, and the potential of mental imagery for everyday goals and digital well-being. Move the existing sentence about skiing, hiking, and electric guitar into Beyond work.

Google Scholar could not be retrieved during review. The rewrite is grounded in the homepage's publication list and these original sources:

- https://ojs.aaai.org/index.php/ICWSM/article/view/35821
- https://arxiv.org/abs/2508.01906
- https://arxiv.org/abs/2509.18297

The broader framing is an editorial synthesis. Accessibility remains a stated research interest, not a claim about the focus of these published papers.

The user confirmed the distinction during implementation: foreground Human–AI Interaction as the overall direction and present AI + Visualization as a Ph.D. research interest.

The user subsequently clarified that this interest extends beyond data analysis and conventional charts to visual information, representations for knowledge work, mental imagery, and metacognition. The revised paragraph preserves that breadth without treating all visual content as data visualization or retrospectively labeling every prior study as metacognition. Mental imagery and well-being applications remain tentative research interests, not demonstrated outcomes. Conceptual references:

- https://www.cs.ubc.ca/~tmm/courses/547-26/
- https://dictionary.apa.org/metacognition
- https://pmc.ncbi.nlm.nih.gov/articles/PMC4097944/
- https://pubmed.ncbi.nlm.nih.gov/22058106/

The user then requested third-person introduction copy, using Jiangnan Xu's bio
as a tone reference. The introduction now starts with “Ester Chen is…” and uses
she/her throughout, including the personal sentence in Beyond work. Publication
summaries retain “We” to describe the collaborative research, as requested.

### Subsequent introduction revision

The user later requested less repetition of AI in the opening and a clearer
connection to HCI, human agency, and responsible technology. This supersedes the
earlier foregrounding of human–AI interaction. The introduction now has four
paragraphs: identity, research questions, published work and venues, and developing
doctoral interests. It mentions AI once in the description of existing work.
CHI, CSCW, and ICWSM are listed without an unsupported “high-impact” claim.
Algorithmic accountability is presented as an emerging question, not an
established contribution in auditing or governance. Visual representations,
metacognition, mental imagery, accessibility, and digital well-being remain.

The wording was informed by official descriptions of
[Social Algorithms](https://www.media.mit.edu/groups/social-algorithms/overview/),
[Cyborg Psychology](https://www.media.mit.edu/groups/cyborg-psychology/overview/),
and [Fluid Interfaces](https://www.media.mit.edu/groups/fluid-interfaces/overview/).
The News traineeship label now links to the verified
[RIT AWARE-AI NSF Research Traineeship (NRT) homepage](https://www.rit.edu/nrtai/).

## Publication layout and sources

Adapt the left-figure/right-text layout of https://www.jiangnanxu.net/ while
preserving the current publication order, titles, author order, venues, keywords,
and DOI links. Author given and middle names appear as initials; surnames remain
spelled out. Keep Ester's name bold and preserve her co-first-author marker.

Each entry includes an original-paper figure, two concise summary sentences,
and a small publisher button. The fourth paper links to AAAI Proceedings rather
than ACM. Stack the figure above the text on narrow screens. Store editable
content in `_data/publications.yml`; rendering and styles live in scoped includes
and SCSS. Figure provenance is recorded in `images/publications/README.md`.

The summaries were checked against the full papers. The deepfake reliance study
uses the 390 completed/analyzed responses rather than the 400 recruited people.
The training study analyzed 237 participants. The scenario review's 125-paper
method-use corpus is distinct from its separately traced 26-paper method-family
corpus. Do not describe the qualitative-analysis prototype interviews as a
comparative performance experiment or treat intended mental-imagery research as
completed empirical work.

## Uploaded photos and privacy edits

The user uploaded 24 Instagram Story screenshots and explicitly selected pure
pixel cropping without AI redrawing. All 24 are now square crops with generic
descriptive filenames, selected individually to remove account headers,
location stickers, personal writing, and other identifying edge details. The
gallery frames are square as well, retaining the original four-percent hover
zoom. No photo has a link or lightbox.

The original files were SHA-256 verified and backed up outside the repository
at `/Users/ejc/Pictures/Beyond-work-originals-2026-09-23` before replacement.
The original manifest and crop-coordinate mapping remain in that private
backup. Only cropped photos are stored in the website folder. All final files
are square and contain no EXIF, XMP, or IPTC metadata. Visual review and local
OCR found no recognizable account handle or location-sticker remnants; ordinary
product labels and public signage within the photographs were retained.

### Second photo batch and palette revision

The user added 18 more photos, including eight HEIC files, and then requested
removal of two duplicate portrait crops from Beyond work while preserving the
website avatar. Those two files were matched to the supplied attachments by
exact decoded pixels. The remaining 16 photos were individually cropped to
squares, converted to JPEG, limited to 1200 pixels per side without upscaling,
and stripped of metadata. All 18 originals and the crop mapping are backed up
outside the website at
`/Users/ejc/Pictures/Beyond-work-originals-2026-09-23-batch-2`.
The gallery now has 40 square photos. The first 24 image hashes and the avatar
hash are unchanged. Visual review and on-device OCR checked the new crops for
remaining account overlays. The personal sentence now includes practicing latte
art.

For a separately uploaded castle portrait, the user requested removal of
recognizable background faces. The built-in image editor produced
`41-castle-at-night-retouched.png`, keeping the portrait framing. The edit prompt
requested local removal of background faces while preserving the foreground
subject, clothing, pose, and blue-lit castle. The original `IMG_5099 2.JPG` was
SHA-256 verified and backed up outside the site in
`/Users/ejc/Pictures/Beyond-work-originals-2026-09-23-photo-retouch` before removal
from the public gallery folder. This retouch is separate from the earlier pure
pixel square crops; the gallery now contains 41 photos.

### Third photo batch

The user added ten more images, then five additional images while cropping was
in progress, and requested the same pure pixel square crops. All fifteen were
individually framed, converted to metadata-free RGB JPEGs, and limited to 1200
pixels per side without upscaling. The existing retouched castle portrait was
also cropped to a square as `41-castle-at-night.jpg`, removing its narrow right
border; its full portrait version is retained in the private backup. No new AI
editing was used for this batch. Visual review and local OCR found no account
overlays in the final crops; public scene signage was retained.

Originals, the full retouched portrait, hashes, and crop-coordinate manifests are
stored in `/Users/ejc/Pictures/Beyond-work-originals-2026-09-23-batch-3` outside
the website. The 38 earlier square photos present at the start and the avatar
remain byte-for-byte unchanged. The gallery now contains 54 square photos;
previously removed photos were not restored. The generated site contains only
the processed photos, with no raw uploads or HEIC files. Browser verification
confirmed all 54 unique images load as squares, the gallery has no image links,
and the mobile layout does not overflow.

The user subsequently requested a site-wide macaron palette and a more visible
E. Chen author name. This supersedes the earlier teal/coral palette. Keep the
existing type and layout, using cool paper (`#F5F6FA`), powder blue (`#DDEAF5`),
lilac (`#E7E0F3`), mint (`#DEEEE8`), and peach (`#F7E5DB`) for surfaces, with
slate (`#303B4B`) for readable text. Pastel surfaces organize content; saturated
decorative gradients are removed. A coordinated dark theme retains readable
text and distinct calendar states.

E. Chen receives a small outlined person icon and a lilac border/background
within each publication's author list. The icon is decorative and hidden from
assistive technology; the name remains real text and the co-first-author
asterisk remains intact. A person icon avoids confusion with contribution stars.

## Files and behavior

### Latest introduction and navigation revisions

At the user's request, the introduction is now three short paragraphs, inspired
by the Personal Robots and Social Algorithms group overviews at MIT Media Lab.
The first gives Ester's Ph.D. program and plain-text "working with Prof. Hidy
Kong" without a link, then states membership in the Center for Accessibility and
Inclusion Research (CAIR), linked to `https://www.rit.edu/cair/` at the user's
request. The second states existing work and publication venues;
the third frames accessible design, algorithmic accountability, accessibility,
autonomy, well-being, and understanding and questioning algorithmic systems as
future research aims. The latest wording emphasizes interpreting digital
information, deciding when to rely on automated systems, and maintaining control
over decisions. To connect with Social Algorithms without overstating past work,
the research paragraph explicitly names visual misinformation, trust in automated
advice, and ownership of interpretations in qualitative analysis. Algorithmic
audits, civic governance, community interventions, and safety evaluation are not
claimed as completed work. Retain visual and interactive tools
without the removed human cognition label. The latest preference is to name
Ester Chen once at the start of the introduction and use she/her thereafter.
Keep Ester in Beyond work and retain third-person prose throughout.

Education navigation now uses the explicit `#education` target. Preserve
`#-education` and `#-educations` as legacy anchors. These targets have a scroll
offset for the fixed masthead. The build and browser checks passed for home
navigation, direct legacy/canonical links, cross-page navigation, and mobile
positioning. The shortened introduction and absence of an advisor link were
also verified in the rendered page.

### Education readability and institution colors

Education uses a compact vertical timeline with decorative graduation-cap icons
for the three degree entries and a globe for the exchange entry. Institution
names lead each record; qualifications, departments, countries, and date chips
retain all four original records without changing their facts. Dates stack below
institution names on mobile. Preserve orange for Rochester Institute of
Technology, blue for Penn State, and purple for Western Ontario and Warwick.
The user's latest correction is dark to light in record order: RIT is darkest
and Warwick is lightest, superseding the earlier request for deep-purple Warwick.
They are scoped to Education so this progression does not change other sections:

| Institution | Light theme | Dark theme |
| --- | --- | --- |
| Rochester Institute of Technology | `#985D36` | `#523823` |
| Penn State University | `#9BB5D2` | `#3E5069` |
| University of Western Ontario | `#CFBEE2` | `#635474` |
| University of Warwick | `#EEE6F5` | `#716280` |

Icon backgrounds and date chips share each accent. RIT uses white; the other
three retain the theme's text color. Relative luminance strictly increases
in both themes, and the minimum icon/date-text contrast is 4.68:1 (dark-mode Warwick).

The Jekyll build and 12 browser checks passed, including the requested color
mapping, preserved qualifications and dates, decorative icon semantics, text
contrast of at least 4.5 in both themes, 390px and 320px layouts without overflow,
and the legacy Education anchor. Desktop light/dark and mobile screenshots were
reviewed. The verification explicitly reloads the preview because changing only
the hash can retain a previously loaded version of the page.

- Discover supported images in `images/beyond-work/` at Jekyll build time in filename order.
- A scoped include, stylesheet, and homepage-only script handle rendering and motion without a new framework or Jekyll plugin.
- An empty folder shows the section heading and personal sentence without broken image tiles or an empty gallery control.
- Render photos without hyperlinks or lightbox bindings, and disable ordinary image dragging. Public assets can still be fetched or saved; this feature is not access control.
- Provide upload instructions in the folder, including supported formats, filenames, web-sized copies, and the public nature of uploaded assets.

## Verification

Build the Jekyll site; test empty, one-photo, and multi-photo collections with temporary test assets outside the source repository. Check continuous motion, seam coverage, small hover scaling, pause/resume, no single-image navigation, mobile overflow, dark theme, reduced motion, and no-JavaScript fallback. Keep test images and build output out of the committed source.

## Verification results

- Full build passed with the repository's locked Jekyll 3.9.0 and GitHub Pages 215 dependencies, installed in a temporary directory without changing the Gemfile or lockfile.
- Thirty browser checks passed for empty-folder rendering, seven-photo discovery, URL encoding (spaces, ampersands, hash marks, Chinese filenames, uppercase extensions), opposing motion, equal loop-group widths, hover pause and 1.04 scale, click behavior, manual pause/resume, 390px and 320px layouts, reduced-motion keyboard scrolling, and the no-JavaScript fallback.
- A separate single-photo test passed at a 1920px browser width, including loop coverage at the start, midpoint, and just before the seam.
- Desktop, mobile, and dark-theme screenshots were inspected. The upload README is absent from the generated public site.
- JavaScript syntax and `git diff --check` passed. All test images remain in temporary directories.
- After installing the 24 final crops and four publication figures, the full
  build and 21 browser checks passed. All four summaries occupy two lines at
  the tested 1440px desktop viewport; the publication rows stack at 390px and
  320px without page overflow. All 24 photos load as square images and frames;
  opposing motion, pause/resume, four-percent hover zoom, reduced motion, and
  no-JavaScript behavior still pass. Light/dark and mobile screenshots were
  reviewed. The generated site contains exactly 24 cropped gallery JPEGs and
  four publication JPEGs, with no original screenshots or upload README files.
- After the second batch and macaron update, the build and 15 browser checks
  passed: all 40 square photos load, all four author badges retain their text
  and contribution markers, both mobile widths avoid overflow, and the six
  weekly unavailable blocks remain intact. Light/dark and mobile screenshots
  were reviewed after theme transitions settled. The generated gallery contains
  only 40 cropped JPEGs; the avatar hash is unchanged.
- The gallery now preloads photos, including animated copies, when it approaches
  the viewport, preventing native lazy loading from leaving moving frames blank.
  Verified decoded-image rendering, preload retention after resize, and the
  40-photo reduced-motion fallback. The final introduction omits human cognition
  and names visual representations and interactive systems instead.

### Fourth photo batch and three-row gallery

Five new uploads were individually square-cropped without AI redraw and exported
as 1200px RGB JPEGs with EXIF/XMP/IPTC removed. Visual inspection and local OCR
found no Instagram usernames; ordinary market price signage remains. Originals
and crop records are stored outside the repository in
`/Users/ejc/Pictures/Beyond-work-originals-2026-09-23-batch-4`.
All 54 existing crops and the website avatar remain byte-for-byte unchanged.
The gallery now contains 59 photos, divided into three rows of 20, 20, and 19.
Eleven browser checks passed for row balance, alternating directions, seamless
loop coverage, photo uniqueness, pause/hover, resize preloading, mobile layout,
and the reduced-motion fallback. Desktop and mobile screenshots were reviewed.

Beyond work copy includes the user's requested humor about slope rush hour and
a leg injury, and the preference for matcha ("preferably with matcha").
Each publication now includes a small author-count pill computed
from its comma-separated author list, preserving the E. Chen badge and co-first
marker rather than duplicating counts in the publication data.

The latest introduction specifies responsible assistive technologies as the
future development goal, connecting visual and interactive tools to understanding
and questioning algorithmic systems. The summary of existing publications keeps
the broader human-computer interaction and responsible technology framing.
Final browser checks verified the corrected dark-to-light Education progression,
contrast in both themes, all four computed author counts (4/5/5/6), retained author
badges and contribution marker, humorous personal copy, and 390px/320px layouts.
The user's final wording broadens the research example to "ownership in data
analysis and knowledge work" while keeping the individual publication summary
specific to the qualitative analysis study.
