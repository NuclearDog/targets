# What it is

A way to track bullets you put through targets.

# Setup

1. Clone the repository somewhere.
2. Edit `targets/index.php` to reflect your database connection settings. See the
RedbeanPHP documentation for information on the format of this DSN and how to use
MySQL, SQLite, and other engines.
3. Initialize the database. A sample MySQL dump is provided with a single target
type. Set up your shooting locations.
4. Access index.html.

# Use

1. Add a trip. A trip is a single visit to a shooting location.
2. Add targets to that trip. Each target is a single piece of paper you put holes
through while you were there.
3. Plot the location of your shots on that target.

# Things to Know

* No analysis is provided right now - the software is very simple and primarily meant
as a easy UI for getting your shots into a database. You can analyze your shooting in
SQL.
* All bullet holes are rendered at approximately 0.22 inches.

# License

See [LICENSE.md](LICENSE.md) for full license details.

All original works licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-nd/4.0/.

This means:

* Attribution: You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
* NonCommercial — You may not use the material for commercial purposes.
* NoDerivatives — If you remix, transform, or build upon the material, you may not distribute the modified material.
