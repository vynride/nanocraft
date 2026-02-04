async def scrape_site(url: str):
    """Scrape site data and return text for image generation"""
    print(url)
    return """
	This is a continuation of building from a distance between myself and my nephew. You can see the previous instructable here: Something With Nails

This trebuchet was designed specifically for the included projectile and proportions, densities, moments of inertia, and release angle were all finely tuned for the greatest range possible without becoming dangerously and cost prohibitively heavy for shipping. But still, don't drop this on your foot.

My design parameters and simulation can be found here. Under a perfect frictionless system this trebuchet should be able to reach 22 feet. Unfortunately due to reality, I could only get it as far as 17 feet (77% efficient). Possible improvements include reducing friction in the bearings, reducing friction between the counterweight and the arm, and using a traditional sling release mechanism. I opted to not use a traditional sling as I didn't want to be responsible for a rock breaking a window. As is, this can only (easily) launch the included projectiles. I'm sure if you get creative, you can figure out how to launch sometime else, but that's on you kid.

Supplies

Materials:

    Orange Filament
    2x - 1/4-20 x 2 Button Head Counterweight screw
    4x - 1/4-20 x 1.5 Button Head Axle Bolt
    6x - 1/4-20 Nut
    6x - Ball Bearings 8mm x 22mm x 7mm (608 2RS)
    17x - #4-40 Threaded Inserts
    17x - #4-40 x 3/8 Socket Head Cap Screw
    1x - #6-32 Treaded Insert
    1x - #6-32 x 3/4 Socket Head Cap Screw
    Projectiles
    12x Counterweight Plates (1 1/4 x 4 x 1/8) - 1/4 in. holes drilled 2 in. apart - centered
    2x 16P Nails - Cut and bent as shown

Tools:

    Hex Keys

Arm.STL

Step 1: Assemble Wheels
Assemble Wheels

Take the two wheel halves and insert the bearing.

There are two lengths of internal axle parts. Be sure to use a long and short piece for each wheel.

Insert the four 1/4-20 x 1.5 in. long axle bolt on the flush (short) side of each wheel.
Step 2: Attach Wheel
Attach Wheel
Attach Wheel

Insert four 1/4-20 nut and axle bolt into the base and tighten by hand. Repeat for each wheel.
Step 3: Attach Guide
Attach Guide
Attach Guide

Using six #4-40 x 3/8 socket head cap screws attach the guide to the base. Be sure that the notch aligns with the notch in the base.
Step 4: Assemble Counterweight
Assemble Counterweight

Install two 1/4-20 nuts into the counterweight support. Thread two 1/4-20 x 2 in. long through all of the counterweight plates. Tighten the screws by hand.
Step 5: Install Release Pin
Install Release Pin
Install Release Pin

Install the release pin into the plate. Align the release pin opposite of the launch catch and tighten the #4-40 x 3/8 in. long socket head cap screw by hand.
Step 6: Complete Arm
Complete Arm
Assemble Supports

Press two bearings into the supports and then attach to the completed arm. Be sure that the feet are pointing in on the assembly.
Step 8: Attach to Base
Attach to Base
Using ten #4-40 x 3/8 long socket head cap screws attach the arm assembly to the base and hand tighten.
Step 9: Complete
Complete
Complete

Pull back the arm and secure it with the locking pin. Hook the projectile to the end of the arm. When you are ready to fire, pull the release pin rapidly allowing the trebuchet to roll on the base for maximum range.

Included here is a string that you can either attach to the release pin for launching away from the siege engine, or it can be attached under the guide to tow the weapon.
	"""
