CREATE TABLE `agenda` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`start` text NOT NULL,
	`end` text NOT NULL,
	`person_in_charge` text NOT NULL,
	`duration` integer NOT NULL,
	`activity` text NOT NULL,
	`remarks` text DEFAULT ''
);
