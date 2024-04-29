# Guidance on how to contribute

> All contributions to this project will be released under the Apache License, Version 2.0.
> By submitting a pull request or filing a bug, issue, or
> feature request, you are agreeing to comply with this waiver of copyright interest.
> Details can be found in our [LICENSE](LICENSE).

Thank you for your interest in contributing to Dataverse Frontend! We are open to contributions from everyone. You don't
need permission to participate. Just jump in. If you have questions, please reach out using one or more of the channels
described below.

We aren't just looking for developers. There are many ways to contribute to Dataverse. We welcome contributions
of ideas, bug reports, usability research/feedback, documentation, code, and more! Please, check the [Dataverse main repo]
for more information on how to contribute to the Dataverse project.

Here are ways to get involved:

1. [Star] the project!
2. Answer questions and join in on [issue tracker].
3. [Report a bug] that you find.
4. Browse ["help wanted"] and ["good first issue"] labels for areas of Dataverse/JavaScript/code you know well to consider, build or document.

## Bug Reports/Issues

An issue is a bug (a feature is no longer behaving the way it should) or a feature (something new to Dataverse that helps
users complete tasks). You can browse the Dataverse Frontend [issue tracker] on GitHub by open or closed issues.

Before submitting an issue, please search the existing issues by using the search bar at the top of the page. If there
is an existing open issue that matches the issue you want to report, please add a comment to it.

If there is no pre-existing issue or it has been closed, please click on the "New Issue" button, log in, and write in
what the issue is (unless it is a security issue which should be reported privately to security@dataverse.org).

If you do not receive a reply to your new issue or comment in a timely manner, please email support@dataverse.org with a link to the issue.

### Writing an Issue

For the subject of an issue, please start it by writing the feature or functionality it relates to, i.e. "Create Account:..."
or "Dataset Page:...". In the body of the issue, please outline the issue you are reporting with as much detail as possible.
In order for the Dataverse development team to best respond to the issue, we need as much information about the issue as
you can provide. Include steps to reproduce bugs. Indicate which version you're using, which is shown at the bottom of the page. We love screenshots!

### Issue Attachments

You can attach certain files (images, screenshots, logs, etc.) by dragging and dropping, selecting them, or pasting from
the clipboard. Files must be one of GitHub's [supported attachment formats] such as png, gif, jpg, txt, pdf, zip, etc.
(Pro tip: A file ending in .log can be renamed to .txt, so you can upload it.) If there's no easy way to attach your file,
please include a URL that points to the file in question.

[supported attachment formats]: https://help.github.com/articles/file-attachments-on-issues-and-pull-requests/

## Documenting

This is probably one of the most important things you can do as a contributor and probably one of the easiest things you can do.
For the moment we only use the [README], which you can edit right here on GitHub!

if there is a mistake you can just press the edit button on the file and make the change directly even without an IDE.
These pull requests are highly appreciated and will help future generations of developers!

[README]: https://github.com/IQSS/dataverse-frontend/edit/develop/README.md

## Changing the code-base

If you are interested in working on the Dataverse Frontend code, great! Before you start working on something we would
suggest talking to us in the [Zulip UI Dev Stream]

Generally speaking, you should fork this repository, make changes in your own fork, and then submit a pull request. All
new code should have associated unit tests that validate implemented features and the presence or lack of defects.
Additionally, the code should follow any stylistic and architectural guidelines prescribed by the project. In the absence
of such guidelines, mimic the styles and patterns in the existing code-base.

Pull requests are highly appreciated. More than [5 people] have written parts of Dataverse Frontend (so far). Here are some
guidelines to help:

1. **Solve a problem** – Features are great, but even better is cleaning-up and fixing issues in the code that you discover.
2. **Write tests** – This helps preserve functionality as the codebase grows and demonstrates how your change affects the code.
3. **Write documentation** – We have a [README] that always needs updating.
4. **Small > big** – Better to have a few small pull requests that address specific parts of the code, than one big pull request that jumps all over.
5. **Comply with Coding Standards** – See next section.

### How to start

After you’ve forked the Dataverse Frontend repository, you should follow the Getting Started instructions in the
[Developer Guide](DEVELOPER_GUIDE.md) to get your local environment up and running.

### GitHub reviews & assignments

All PRs receive a review from at least one maintainer. We’ll do our best to do that review as soon as possible, but we’d
rather go slow and get it right than merge in code with issues that just lead to trouble.

You might see us assign multiple reviewers, in this case these are OR checks (i.e. either Person1 or Person2) unless we
explicitly say it’s an AND type thing (i.e. can both Person3 and Person4 check this out?).

We use the assignee to show who’s responsible at that moment. We’ll assign back to the submitter if we need additional
info/code/response, or it might be assigned to a branch maintainer if it needs more thought/revision (perhaps it’s directly
related to an issue that's actively being worked on).

After making your pull request, your goal should be to help it advance through our kanban board at [IQSS Dataverse Project].
If no one has moved your pull request to the code review column in a timely manner, please reach out. Note that once a pull request
is created for an issue, we'll remove the issue from the board so that we only track one card (the pull request).

Thanks for your contribution!

## Other ways to contribute to the code

We love code contributions. Developers are not limited to the Frontend Dataverse code in this git repo. You can help with
API client libraries in your favorite language that are mentioned in the [API Guide][] or create a new library. In this
repo we are using the [JavaScript Dataverse API client library] in which you can contribute to as well.

[API Guide]: http://guides.dataverse.org/en/latest/api
[issue tracker]: https://github.com/IQSS/dataverse-frontend/issues
[Dataverse main repo]: https://github.com/IQSS/dataverse/blob/develop/CONTRIBUTING.md
[Star]: https://github.com/iqss/dataverse-frontend/stargazers
[Report a bug]: https://github.com/iqss/dataverse-frontend/issues/new?assignees=&labels=&projects=&title=%5BBUG%5D+Your+title
["help wanted"]: https://github.com/iqss/dataverse-frontend/labels/help%20wanted
["good first issue"]: https://github.com/iqss/dataverse-frontend/labels/good%20first%20issue
[Zulip UI Dev Stream]: https://dataverse.zulipchat.com/#narrow/stream/410361-ui-dev
[5 people]: https://github.com/iqss/dataverse-frontend/graphs/contributors
[Getting Started Section]: https://github.com/IQSS/dataverse-frontend?tab=readme-ov-file#getting-started
[TypeScript Deep Dive Style Guide]: https://basarat.gitbook.io/typescript/styleguide
[pre-commit]: https://www.npmjs.com/package/pre-commit
[IQSS Dataverse Project]: https://github.com/orgs/IQSS/projects/34
[JavaScript Dataverse API client library]: https://github.com/IQSS/dataverse-client-javascript
