# Git Workflow & Commit Strategy

To maintain a clean and structured codebase, we follow a strict Git workflow
that includes a defined branching strategy and commit conventions.

## 🌿 Branching Strategy

We use a **merge-based strategy** with all changes being introduced via **pull
requests (PRs)**. Our branch structure is as follows:

- **`develop` (Source of Truth & Staging)**:
  - All feature branches are merged here via PRs.
  - Deployments to the **staging environment** are triggered from this branch.
- **`master` (Production-Ready Code)**
  - Stable, production-ready code is merged into `master` from `develop`.
  - Deployments to the **production environment** happen from this branch.
- **Feature branches (`feature/branch-name`)**
  - Created from `develop` for new features or improvements.
  - Merged back into `develop` via PR after review and approval.
- **Bugfix branches (`fix/branch-name`)**
  - Created from `develop` for addressing issues .
  - Merged back into `develop` via PR after review and approval.
- **Hotfix branches (`hotfix/branch-name`)**
  - Created from `master` for urgent fixes that must go directly to production.
  - Merged into both `master` and `develop` after deployment.

## ✍️ Commit Convention

We use **[Conventional Commits](https://www.conventionalcommits.org/)** to
maintain a readable and structured commit history. This ensures clarity in
commit messages and helps with automated changelog generation.

### 📝 **Commit Message Format**

```
type(scope): message
```

#### 🔷 **Common Commit Types:**

- `feat`: A new feature
- `fix`: A bug fix
- `chore`: Changes to the build process or auxiliary tools
- `docs`: Documentation updates
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code changes that neither fix a bug nor add a feature
- `test`: Adding or modifying tests
- `perf`: Performance improvements

#### ✨ **Example Commits:**

```
feat(auth): add OAuth2 support
fix(api): resolve data fetch issue on dashboard
chore(ci): update GitHub Actions workflow
```

## ⚙️ Using `git-cz` for Commit Messages

We use **[git-cz](https://github.com/commitizen/cz-cli)** to enforce the
**Conventional Commits** standard. Once the project dependencies are installed,
you can use the command `yarn commit` to create structured commit messages for
all **staged changes** in Git.

### 🛠️ How to Use

1. **Stage Your Changes**

   Before committing, add the modified files to the staging area:

   ```sh
   git add <file>
   # or stage all changes
   git add .
   ```

2. **Start the Commit Process**

   Run the following command to launch the commit prompt:

   ```sh
   yarn commit
   ```

3. **Select a Commit Type**

   Choose the type of change you are committing by navigating through the list:

   ```
   ? Select the type of change that you're committing: (Use arrow keys or type to search)
     💍  test:       Adding missing tests
     🎸  feat:       A new feature
   ❯ 🐛  fix:        A bug fix
     🤖  chore:      Build process or auxiliary tool changes
     ✏️  docs:       Documentation only changes
     💡  refactor:   A code change that neither fixes a bug nor adds a feature
     💄  style:      Markup, whitespace, formatting, missing semicolons...
   ```

4. **Write a Short Description**

   Provide a brief, imperative description of the change:

   ```shell
   ? Write a short, imperative mood description of the change:
   [-------------------------------------------------------------] 21 chars left
   fix: resolve issue with login validation
   ```

5. **Add a Detailed Description (Optional)**

   If necessary, provide additional context or details about the change. You can
   skip this step by pressing `Enter`.

   ```shell
   ? Provide a longer description of the change:
     Refactored the validation logic to ensure correct error messages are displayed.
   ```

6. **⚠️ Handle Breaking Changes with Caution (Optional)**

   **Breaking changes are critical and should be declared only when absolutely
   necessary.** A breaking change means that the update is **not
   backward-compatible** and will force major version increments according to
   [Semantic Versioning](https://semver.org/).

   Only mark a change as breaking if:

   - It modifies or removes existing functionality in a way that will break
     current users.
   - It introduces API changes requiring consumer-side adjustments.
   - It alters behavior in a way that could impact deployments.

   **🚨 WARNING:** Misusing breaking changes can cause unnecessary disruptions.
   Ensure proper discussions and approvals before marking a change as breaking.

   If your change qualifies as a breaking change, specify the impact clearly,
   otherwise skip this step by pressing `Enter`.

   ```shell
   ? List any breaking changes
     BREAKING CHANGE: Authentication now requires an OAuth token instead of a password.
   ```

7. **Reference Related Issues (Optional)**

   If your commit addresses or closes an issue, mention it here. You can skip
   this step by pressing `Enter`.

   ```shell
   ? Issues this commit closes, e.g., #123: #45
   ```

---

By following this workflow, we ensure consistent, readable, and well-documented
commit messages, making the project easier to maintain and scale. 🚀
